package com.thechakra.backend.service;

import com.thechakra.backend.dto.*;
import com.thechakra.backend.entity.RefreshToken;
import com.thechakra.backend.entity.Role;
import com.thechakra.backend.entity.User;
import com.thechakra.backend.entity.VerificationToken;
import com.thechakra.backend.repository.UserRepository;
import com.thechakra.backend.repository.VerificationTokenRepository;
import com.thechakra.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

        private static final SecureRandom SECURE_RANDOM = new SecureRandom();

        private final UserRepository userRepository;
        private final VerificationTokenRepository verificationTokenRepository;
        private final EmailService emailService;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;
        private final UserMapper userMapper;
        private final RefreshTokenService refreshTokenService;

        @Value("${chakra.root-secret}")
        private String rootSecret;

        private String generateOtp() {
                return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        }

        @Transactional
        public void requestAdminAccess(String name, String email) {
                emailService.sendAdminApprovalRequest(email, name);
        }

        @Transactional
        public void generateAdminOtp(RootAdminOtpRequestDto request) {
                if (!rootSecret.equals(request.getRootSecret())) {
                        throw new IllegalArgumentException("Invalid Root Secret");
                }

                verificationTokenRepository.deleteByEmailAndTokenType(request.getCandidateEmail(),
                                VerificationToken.TokenType.ADMIN_REGISTRATION);

                String otp = generateOtp();
                VerificationToken token = VerificationToken.builder()
                                .email(request.getCandidateEmail())
                                .token(otp)
                                .tokenType(VerificationToken.TokenType.ADMIN_REGISTRATION)
                                .expiryDate(LocalDateTime.now(ZoneId.of("UTC")).plusHours(24))
                                .build();
                verificationTokenRepository.save(token);

                emailService.sendEmail(request.getCandidateEmail(), "Your Admin Access Code",
                                "The Root Authority has approved your request. Your Admin Access Code is: " + otp);
        }

        @Transactional
        public AuthResponseDto register(RegisterRequestDto request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("Email already in use");
                }
                if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()
                                && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                        throw new IllegalArgumentException("Phone number already in use");
                }

                Role assignedRole = Role.STUDENT;

                if (request.getAdminCode() != null && !request.getAdminCode().trim().isEmpty()) {
                        Optional<VerificationToken> otpOpt = verificationTokenRepository
                                        .findByEmailAndTokenType(request.getEmail(),
                                                        VerificationToken.TokenType.ADMIN_REGISTRATION);

                        if (otpOpt.isPresent()) {
                                VerificationToken token = otpOpt.get();
                                log.debug("[DEBUG] Comparing Input: {} with DB Token: {} for Type: {}",
                                                request.getAdminCode(), token.getToken(),
                                                VerificationToken.TokenType.ADMIN_REGISTRATION);

                                if (token.getToken().equals(request.getAdminCode())
                                                && token.getExpiryDate().isAfter(LocalDateTime.now(ZoneId.of("UTC")))) {
                                        assignedRole = Role.ADMIN;
                                        verificationTokenRepository.delete(token);
                                } else {
                                        log.debug("[DEBUG] Token Mismatch or Expired. Input: {}, DB: {}, Expired: {}",
                                                        request.getAdminCode(), token.getToken(), token.getExpiryDate()
                                                                        .isBefore(LocalDateTime.now(ZoneId.of("UTC"))));
                                }
                        } else {
                                log.debug("[DEBUG] No DB Token found for Input: {} and Type: {}",
                                                request.getAdminCode(), VerificationToken.TokenType.ADMIN_REGISTRATION);
                        }
                }

                String phoneToSave = (request.getPhoneNumber() != null && request.getPhoneNumber().trim().isEmpty())
                                ? null
                                : request.getPhoneNumber();

                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .phoneNumber(phoneToSave)
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(assignedRole)
                                .build();

                userRepository.save(user);

                String jwtToken = jwtUtils.generateToken(user.getEmail());
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

                return AuthResponseDto.builder()
                                .token(jwtToken)
                                .refreshToken(refreshToken.getToken())
                                .user(userMapper.toDto(user))
                                .build();
        }

        @Transactional
        public AuthResponseDto login(LoginRequestDto request) {
                User user = userRepository.findByEmailOrPhoneNumber(request.getIdentifier(), request.getIdentifier())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid email/phone or password"));

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword()));

                if (user.getRole() == Role.ADMIN) {
                        verificationTokenRepository.deleteByEmailAndTokenType(user.getEmail(),
                                        VerificationToken.TokenType.ADMIN_LOGIN);
                        String otp = generateOtp();
                        VerificationToken token = VerificationToken.builder()
                                        .email(user.getEmail())
                                        .token(otp)
                                        .tokenType(VerificationToken.TokenType.ADMIN_LOGIN)
                                        .expiryDate(LocalDateTime.now(ZoneId.of("UTC")).plusMinutes(30))
                                        .build();
                        verificationTokenRepository.save(token);

                        emailService.sendEmail(user.getEmail(), "Admin Login Verification",
                                        "Your OTP for login is: " + otp);

                        return AuthResponseDto.builder()
                                        .message("OTP_SENT")
                                        .user(userMapper.toDto(user))
                                        .build();
                }

                String jwtToken = jwtUtils.generateToken(user.getEmail());
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

                return AuthResponseDto.builder()
                                .token(jwtToken)
                                .refreshToken(refreshToken.getToken())
                                .user(userMapper.toDto(user))
                                .build();
        }

        @Transactional
        public AuthResponseDto verifyAdminLogin(VerifyOtpRequestDto request) {
                // Resolve the identifier (email OR phone number) to the actual user,
                // because the OTP was stored under the user's real email address.
                User user = userRepository.findByEmailOrPhoneNumber(request.getEmail(), request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                String actualEmail = user.getEmail(); // always the stored email

                Optional<VerificationToken> dbTokenOpt = verificationTokenRepository
                                .findByEmailAndTokenType(actualEmail, VerificationToken.TokenType.ADMIN_LOGIN);

                if (dbTokenOpt.isPresent()) {
                        VerificationToken token = dbTokenOpt.get();
                        log.debug("[DEBUG] Comparing Input: {} with DB Token: {} for Type: {}", request.getOtp(),
                                        token.getToken(), VerificationToken.TokenType.ADMIN_LOGIN);

                        if (!token.getToken().equals(request.getOtp())) {
                                throw new IllegalArgumentException("Invalid OTP");
                        }

                        if (token.getExpiryDate().isBefore(LocalDateTime.now(ZoneId.of("UTC")))) {
                                throw new IllegalArgumentException("OTP expired");
                        }

                        verificationTokenRepository.delete(token);
                } else {
                        log.debug("[DEBUG] No DB Token found for email: {} and Type: {}", actualEmail,
                                        VerificationToken.TokenType.ADMIN_LOGIN);
                        throw new IllegalArgumentException("Invalid OTP");
                }

                String jwtToken = jwtUtils.generateToken(user.getEmail());
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

                return AuthResponseDto.builder()
                                .token(jwtToken)
                                .refreshToken(refreshToken.getToken())
                                .user(userMapper.toDto(user))
                                .build();
        }

        @Transactional
        public void forgotPassword(ForgotPasswordRequestDto request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                verificationTokenRepository.deleteByEmailAndTokenType(user.getEmail(),
                                VerificationToken.TokenType.FORGOT_PASSWORD);

                String otp = generateOtp();
                VerificationToken token = VerificationToken.builder()
                                .email(user.getEmail())
                                .token(otp)
                                .tokenType(VerificationToken.TokenType.FORGOT_PASSWORD)
                                .expiryDate(LocalDateTime.now(ZoneId.of("UTC")).plusMinutes(30))
                                .build();
                verificationTokenRepository.save(token);

                emailService.sendEmail(user.getEmail(), "Password Reset", "Your password reset code is: " + otp);
        }

        @Transactional
        public void resetPassword(ResetPasswordRequestDto request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                Optional<VerificationToken> dbTokenOpt = verificationTokenRepository
                                .findByEmailAndTokenType(request.getEmail(),
                                                VerificationToken.TokenType.FORGOT_PASSWORD);

                if (dbTokenOpt.isPresent()) {
                        VerificationToken token = dbTokenOpt.get();
                        log.debug("[DEBUG] Comparing Input: {} with DB Token: {} for Type: {}", request.getOtp(),
                                        token.getToken(), VerificationToken.TokenType.FORGOT_PASSWORD);

                        if (!token.getToken().equals(request.getOtp())) {
                                throw new IllegalArgumentException("Invalid OTP");
                        }

                        if (token.getExpiryDate().isBefore(LocalDateTime.now(ZoneId.of("UTC")))) {
                                throw new IllegalArgumentException("OTP expired");
                        }

                        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                        userRepository.save(user);
                        verificationTokenRepository.delete(token);
                } else {
                        log.debug("[DEBUG] No DB Token found for Input: {} and Type: {}", request.getOtp(),
                                        VerificationToken.TokenType.FORGOT_PASSWORD);
                        throw new IllegalArgumentException("Invalid OTP");
                }
        }

        @Transactional
        public TokenRefreshResponseDto refreshToken(TokenRefreshRequestDto request) {
                String requestRefreshToken = request.getRefreshToken();
                return refreshTokenService.findByToken(requestRefreshToken)
                                .map(refreshTokenService::verifyExpiration)
                                .map(RefreshToken::getUser)
                                .map(user -> new TokenRefreshResponseDto(jwtUtils.generateToken(user.getEmail()),
                                                requestRefreshToken))
                                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
        }
}
