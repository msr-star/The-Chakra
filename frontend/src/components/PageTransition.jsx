import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
};

const pageTransition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
};

const PageTransition = ({ children, className = '' }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className={className}
    >
        {children}
    </motion.div>
);

export default PageTransition;
