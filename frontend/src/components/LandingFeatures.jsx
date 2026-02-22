import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, LineChart, Award, Quote } from 'lucide-react';

const LandingFeatures = () => {
    return (
        <section className="py-24 relative z-10 bg-background overflow-hidden border-t border-white/5">

            {/* Assessment Types Banner */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-32 text-center">
                <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-8">Comprehensive Assessment Suite</p>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {[
                        { icon: <Brain size={24} />, label: 'Personality Tests' },
                        { icon: <Target size={24} />, label: 'Career Assessments' },
                        { icon: <LineChart size={24} />, label: 'Skills Evaluations' },
                        { icon: <Award size={24} />, label: 'Career Recommendations' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 px-6 py-3 rounded-full glass-panel border border-white/10 text-gray-300 font-medium"
                        >
                            <span className="text-accentLight">{item.icon}</span>
                            {item.label}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">How It Works</h2>
                    <p className="text-xl text-gray-400">Three simple steps to discover your ideal career path.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-accentLight/20 to-transparent z-0" />

                    {[
                        { step: "01", title: "Create Your Account", desc: "Register as a student to access all assessments, track your progress, and save your results." },
                        { step: "02", title: "Take Assessments", desc: "Complete career assessments, personality tests, and skills evaluations tailored to your profile." },
                        { step: "03", title: "Get Career Recommendations", desc: "Receive personalized career path recommendations based on your strengths and preferences." },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative z-10 glass-panel p-8 rounded-3xl text-center flex flex-col items-center border border-white/5 hover:border-accentLight/30 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#020617] border-2 border-accentLight flex items-center justify-center text-xl font-bold text-accentLight mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Student Success Stories</h2>
                    <p className="text-xl text-gray-400">Students who found their ideal career path using our platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-10 rounded-3xl border border-white/5 relative">
                        <Quote className="absolute top-8 right-8 text-white/5" size={64} />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">S</div>
                            <div>
                                <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                <p className="text-sm text-accentLight">Now working in: Backend Engineering</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                            "The career assessment helped me realize that my analytical mindset was best suited for software engineering. The personality test results were spot on and gave me the confidence to pursue a CS degree."
                        </p>
                    </div>

                    <div className="glass-panel p-10 rounded-3xl border border-white/5 relative">
                        <Quote className="absolute top-8 right-8 text-white/5" size={64} />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">M</div>
                            <div>
                                <h4 className="font-bold text-white">Marcus Vance</h4>
                                <p className="text-sm text-accentWarm">Now working in: Product Management</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                            "I was unsure which career to pursue after graduation. The skills evaluation showed me that I excel in leadership and communication, leading me to discover product management as my ideal path."
                        </p>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default LandingFeatures;
