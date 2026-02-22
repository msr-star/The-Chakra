import React from 'react';
import { motion } from 'framer-motion';
import { useMagneticPull } from '../hooks/useMagneticPull';

const MagneticButton = ({ children, onClick, className = '' }) => {
    const { ref, position, handleMouse, reset } = useMagneticPull(0.2);

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative flex items-center justify-center ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default MagneticButton;
