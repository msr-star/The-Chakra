import { useRef, useState } from 'react';

export const useMagneticPull = (pullStrength = 0.3) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * pullStrength, y: middleY * pullStrength });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    return { ref, position, handleMouse, reset };
};
