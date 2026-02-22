import React from 'react';
import HeroSection from '../components/HeroSection';
import BentoGrid from '../components/BentoGrid';
import LandingFeatures from '../components/LandingFeatures';

const LandingPage = () => {
    return (
        <div className="bg-background min-h-screen text-white">
            <HeroSection />
            <LandingFeatures />
            <BentoGrid />
        </div>
    );
};

export default LandingPage;
