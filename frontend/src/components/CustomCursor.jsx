import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
    const mainRef = useRef(null);
    const glowRef = useRef(null);
    // const isHovered = false; // Add hover state logic if deeply needed
    const isHoveredRef = useRef(false);

    useEffect(() => {
        if ("ontouchstart" in window) return;

        let mouseX = -100;
        let mouseY = -100;
        let glowX = -100;
        let glowY = -100;
        let rafId;

        const moveCursor = (e) => {
            mouseX = e.clientX - 16;
            mouseY = e.clientY - 16;
        };

        const handlePointerOver = (e) => {
            const hovered = !!e.target.closest("a, button");
            if (hovered !== isHoveredRef.current) {
                isHoveredRef.current = hovered;
                setIsHovered(hovered);
            }
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const animate = () => {
            if (mainRef.current) {
                mainRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${isHoveredRef.current ? 1.5 : 1})`;
            }

            // Glow trails with lerp (smooth but NOT spring — no lag buildup)
            glowX = lerp(glowX, mouseX, 0.18);
            glowY = lerp(glowY, mouseY, 0.18);

            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${glowX}px, ${glowY}px) scale(${isHoveredRef.current ? 2 : 1})`;
            }

            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        document.addEventListener("pointerover", handlePointerOver, { passive: true });
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("pointerover", handlePointerOver);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            {/* Main cursor — zero lag, direct RAF */}
            <div
                ref={mainRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    backgroundColor: "white",
                    mixBlendMode: "difference",
                    willChange: "transform",
                    transition: "transform 0.08s ease",
                }}
            />

            {/* Glow trail — lerp smoothed, no spring lag */}
            <div
                ref={glowRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9998,
                    backgroundColor: "rgba(96, 165, 250, 0.3)",
                    filter: "blur(8px)",
                    willChange: "transform",
                    transition: "transform 0.05s ease",
                }}
            />
        </>
    );
};

export default CustomCursor;