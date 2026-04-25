import React, { useRef, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

const careerMapping = {
    'Logic': ['Backend Software Engineer', 'Database Administrator', 'Systems Architect'],
    'Creativity': ['UI/UX Designer', 'Frontend Developer', 'Motion Graphics Artist'],
    'Structure': ['DevOps Engineer', 'Infrastructure Specialist', 'QA Lead'],
    'Empathy': ['Product Manager', 'Scrum Master', 'Developer Evangelist'],
    'Vision': ['Product Strategist', 'Enterprise Architect', 'CTO'],
    'Detail': ['Data Scientist', 'Machine Learning Engineer', 'Security Analyst'],
};

const ResultDashboard = ({ result }) => {
    const dashboardRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    if (!result || !result.categoryScores) return null;

    // Transform map into array for Recharts
    const data = Object.keys(result.categoryScores).map((key) => ({
        subject: key,
        A: result.categoryScores[key],
        fullMark: 100, // Assuming max weightage creates a spread up to 100 loosely
    }));

    // Resolve specific career paths from the dominant algorithm output
    const dominantCategory = result.suggestedPath;
    const careerRecommendations = careerMapping[dominantCategory] || ['Technical Consultant', 'Research Analyst', 'Support Engineer'];

    const handleDownloadPdf = async () => {
        if (!dashboardRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                backgroundColor: '#120803',
                logging: false,
                useCORS: true
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Chakra_Alignment_Report.pdf');
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center"
        >
            <div className="w-full flex justify-end mb-4">
                <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accentLight/50 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="text-sm font-medium">{isDownloading ? 'Generating...' : 'Download Report'}</span>
                </button>
            </div>
            {/* The ref wraps the actual content we want to capture */}
            <div ref={dashboardRef} className="w-full flex flex-col items-center p-8 rounded-3xl bg-[#120803]">
                <div className="text-center mb-12 w-full">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accentLight to-white">
                        Alignment Complete
                    </h2>
                    <p className="text-xl text-gray-400 mb-2">
                        Your highest resonance vector is <span className="text-accentLight font-bold uppercase tracking-wider">{dominantCategory}</span>.
                    </p>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Based on your cognitive profiling and skill evaluations, the Chakra Algorithm has determined your optimal career trajectory.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                    {/* Left Side: Radar Chart */}
                    <div className="glass-panel rounded-3xl p-8 relative flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-lg font-bold text-gray-300 w-full text-left mb-4 uppercase tracking-wider">Cognitive Resonance</h3>
                        {/* Glow behind chart */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accentLight/20 blur-[60px] rounded-full" />

                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                                <PolarGrid stroke="#ffffff30" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Resonance"
                                    dataKey="A"
                                    stroke="#22D3EE"
                                    fill="#22D3EE"
                                    fillOpacity={0.4}
                                    isAnimationActive={true}
                                    className="animate-pulse-slow"
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#22D3EE' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Right Side: Specific Career Recommendations */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-2xl font-bold text-white mb-2">Recommended Career Paths</h3>
                        {careerRecommendations.map((career, index) => (
                            <motion.div
                                key={career}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (index * 0.2), type: "spring", stiffness: 100 }}
                                className="bg-white/5 border border-white/10 hover:border-accentLight/50 p-6 rounded-2xl transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-accentLight group-hover:bg-accentWarm transition-colors" />
                                <h4 className="text-xl font-bold text-white mb-2 pl-2">{career}</h4>
                                <p className="text-sm text-gray-400 pl-2">Highly aligned with your {dominantCategory} matrix scoring.</p>
                            </motion.div>
                        ))}

                        {/* Breakdown Matrix Summaries */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                            {data.map((item) => (
                                <div key={item.subject} className="bg-black/40 border border-white/5 rounded-xl p-3 text-center">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{item.subject}</div>
                                    <div className="text-lg font-bold text-gray-200">{Math.round(item.A)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> {/* Closes dashboardRef div */}
        </motion.div>
    );
};

export default ResultDashboard;
