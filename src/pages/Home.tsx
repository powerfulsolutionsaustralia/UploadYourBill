import React from 'react';
import { LeadForm } from '../components/LeadForm';
import { Sun, Battery, Leaf, TrendingDown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/hero.png")' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
                            <Sun className="w-4 h-4 text-primary" />
                            <span className="text-primary font-semibold text-sm">Future Proof Your Home</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Slash Your Energy Bills with <span className="text-primary">Solar & AI</span>
                        </h1>
                        <p className="text-xl text-text-muted mb-8 leading-relaxed">
                            Stop guessing about solar. Our AI analyzes your actual electricity bill to design the perfect solar and battery system for your home or business.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-glass p-2 rounded-lg">
                                    <TrendingDown className="w-5 h-5 text-secondary" />
                                </div>
                                <span className="font-medium">Save Up to 80%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-glass p-2 rounded-lg">
                                    <Shield className="w-5 h-5 text-accent" />
                                </div>
                                <span className="font-medium">25yr Warranty</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-glass p-2 rounded-lg">
                                    <Battery className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-medium">Battery Ready</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <LeadForm />
                    </motion.div>
                </div>
            </section>

            {/* Social Proof / Brands (Optional but good for premium feel) */}
            <section className="py-12 bg-dark-lighter/30 border-y border-glass-border">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-text-muted text-sm font-semibold uppercase tracking-widest mb-8">Trusted by families & businesses across Australia</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Logic for logos would go here */}
                        <span className="text-2xl font-bold">SOLAREX</span>
                        <span className="text-2xl font-bold">NEXTERA</span>
                        <span className="text-2xl font-bold">ENERGYMAX</span>
                        <span className="text-2xl font-bold">POWERBANK</span>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-24 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Why Solar + AI?</h2>
                    <p className="text-text-muted max-w-2xl mx-auto">We don't just sell panels. We use technology to ensure you get the maximum return on investment based on your real energy usage.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Sun className="w-8 h-8 text-primary" />,
                            title: "Precise Sizing",
                            description: "Our AI scans your bill to determine exactly how many panels you need. No more overpaying for capacity you don't use."
                        },
                        {
                            icon: <Battery className="w-8 h-8 text-secondary" />,
                            title: "Battery Optimization",
                            description: "Calculate the exact ROI of adding storage. See how much power you can save for night-time use."
                        },
                        {
                            icon: <Leaf className="w-8 h-8 text-accent" />,
                            title: "Live Monitoring",
                            description: "Your dedicated dashboard lets you talk to your energy data in real-time using our advanced RAG AI system."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-card p-8 hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <div className="bg-dark-lighter w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-text-muted leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-glass-border mt-24">
                <div className="container mx-auto px-6 text-center text-text-muted">
                    <p>&copy; 2025 SolarLeadGen. Powered by AntiGravity AI.</p>
                </div>
            </footer>
        </div>
    );
};
