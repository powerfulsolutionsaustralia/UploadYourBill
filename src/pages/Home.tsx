import React from 'react';
import { LeadForm } from '../components/LeadForm';
import { Sun, Battery, Leaf, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-grid">
            {/* Cinematic Hero */}
            <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
                {/* Deeply layered background */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center scale-110"
                    style={{ backgroundImage: 'url("/hero.png")' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/85 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/60 to-dark-bg"></div>
                </div>

                {/* Floating gradient blobs for depth */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-3xl lg:col-span-7"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 mb-10 group cursor-default">
                            <Star className="w-4 h-4 text-primary fill-primary animate-pulse" />
                            <span className="text-white font-bold text-xs tracking-widest uppercase">The #1 AI Solar Platform</span>
                            <div className="w-1 h-1 bg-white/20 rounded-full mx-1"></div>
                            <span className="text-text-dim text-xs font-semibold">Updated 2026</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-[0.9] tracking-tighter text-shadow-premium">
                            Energy <span className="gradient-text">Independence</span> <br />
                            Starts with AI.
                        </h1>

                        <p className="text-xl md:text-2xl text-text-dim mb-12 leading-relaxed max-w-xl text-shadow-premium">
                            Upload your bill. Our neural network calculates your exact ROI, matches the perfect storage, and designs your path to $0 bills.
                        </p>

                        <div className="flex flex-wrap gap-8 items-center mb-16">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-dark-bg bg-dark-surface flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-2 border-dark-bg bg-primary text-black font-bold flex items-center justify-center text-xs">
                                    +2k
                                </div>
                            </div>
                            <div className="text-sm font-semibold">
                                <div className="flex gap-1 text-primary mb-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-text-dim uppercase tracking-tighter">Trusted by 2,400+ Solar Owners</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: <CheckCircle className="text-secondary" size={20} />, text: "Precise bill parsing" },
                                { icon: <CheckCircle className="text-secondary" size={20} />, text: "Battery ROI calculations" },
                                { icon: <CheckCircle className="text-secondary" size={20} />, text: "Live consultant chat" },
                                { icon: <CheckCircle className="text-secondary" size={20} />, text: "VPP integration analysis" },
                            ].map((item, id) => (
                                <div key={id} className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-bold text-lg text-white/90">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex justify-center relative lg:col-span-5"
                    >
                        {/* Glowing aura behind form */}
                        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full scale-75"></div>
                        <LeadForm />
                    </motion.div>
                </div>
            </section>

            {/* Modern Feature Display */}
            <section className="py-40 container mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter">Stop Browsing. <br /><span className="text-primary">Get Insights.</span></h2>
                        <p className="text-xl text-text-dim">Our proprietary RAG system (Retrieval-Augmented Generation) uses your specific energy history to build your roadmap.</p>
                    </div>
                    <a href="#" className="btn-premium btn-primary-shiny gap-2 group">
                        Explore Technology <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            icon: <Sun className="w-10 h-10 text-primary" />,
                            title: "Neural Bill Scanning",
                            description: "Our AI extracts consumption patterns, peak rates, and demand charges with 99.4% accuracy from your PDF."
                        },
                        {
                            icon: <Battery className="w-10 h-10 text-secondary" />,
                            title: "Storage Simulation",
                            description: "We simulate 8,760 hours of energy usage to find the perfect battery size for your specific evening peak."
                        },
                        {
                            icon: <Leaf className="w-10 h-10 text-accent" />,
                            title: "Carbon Offset Trace",
                            description: "See exactly how many tons of CO2 you will prevent from entering the atmosphere over 25 years."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -15, backgroundColor: 'rgba(255,255,255,0.02)' }}
                            className="glass-card p-12 border-white/5"
                        >
                            <div className="bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border border-white/10">
                                {item.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-5 tracking-tight">{item.title}</h3>
                            <p className="text-text-dim text-lg leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 container mx-auto px-6">
                <div className="glass-card p-20 text-center relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-10 tracking-tighter">Ready to zero your <br /> electricity bill?</h2>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="btn-premium btn-primary-shiny text-2xl px-12 py-6"
                    >
                        Get My Free Analysis
                    </button>
                    <div className="mt-10 flex flex-wrap justify-center gap-10 opacity-30">
                        <span className="font-black text-3xl">TIER 1 PANELS</span>
                        <span className="font-black text-3xl">SMART INVERTERS</span>
                        <span className="font-black text-3xl">LFP BATTERIES</span>
                    </div>
                </div>
            </section>

            {/* Refined Footer */}
            <footer className="py-20 border-t border-white/5 bg-dark-bg/80 backdrop-blur-xl">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary p-2 rounded-xl">
                                <Sun className="w-6 h-6 text-black" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter">Upload Your <span className="text-primary">Bill</span></span>
                        </div>
                        <p className="text-text-dim text-lg max-w-sm">Driving the renewable revolution through artificial intelligence and transparent data analysis.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-text-dim">
                            <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Our AI Models</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Company</h4>
                        <ul className="space-y-4 text-text-dim">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 text-center text-text-dim text-sm border-t border-white/5 pt-10">
                    <p>&copy; 2025 Upload Your Bill. A premium Renewable Solutions company.</p>
                </div>
            </footer>
        </div>
    );
};
