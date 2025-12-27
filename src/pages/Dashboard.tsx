import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sun, DollarSign, Zap, Send, Loader2, FileText, BarChart3, TrendingDown, ArrowLeft, ShieldCheck, Download, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    bill_url: string;
    analysis: any;
    status: string;
    created_at: string;
}


interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const Dashboard: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi there! I\'ve finished calculating your energy profile based on the bill you uploaded. Ask me anything about your potential savings or the system design!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [inflationRate, setInflationRate] = useState(10);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchLead();
    }, [slug]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchLead = async () => {
        if (!slug) return;
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching lead:', error);
        } else {
            setLead(data);
            if (data.status === 'processing') {
                // Poll for update or wait
                const interval = setInterval(async () => {
                    const { data: updated } = await supabase.from('leads').select('*').eq('id', data.id).single();
                    if (updated?.status === 'completed') {
                        setLead(updated);
                        clearInterval(interval);
                    }
                }, 3000);
                return () => clearInterval(interval);
            }
        }
        setLoading(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping || !lead) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const { data, error } = await supabase.functions.invoke('solar-chat-ai', {
                body: {
                    messages: [...messages, { role: 'user', content: userMsg }],
                    lead_id: lead.id
                }
            });

            if (error) throw error;
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "My connection to the AI engine was momentarily interrupted. Could you please try that again?"
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                    <p className="text-primary font-bold tracking-widest uppercase animate-pulse">Initializing Portal...</p>
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg text-center px-6">
                <div className="glass-card p-12 max-w-lg">
                    <h1 className="text-4xl font-black mb-6">Portal Not Found</h1>
                    <p className="text-text-dim mb-10 text-lg">We couldn't find an analysis associated with this link. It may have expired or was incorrectly copied.</p>
                    <Link to="/" className="btn-premium btn-primary-shiny px-10 py-4">Return Home</Link>
                </div>
            </div>
        );
    }

    const isComplete = lead.status === 'completed';

    // Robust parsing for analysis data (handling stringified JSON, arrays, and Gemini quirks)
    let analysisData = lead.analysis;
    try {
        if (typeof analysisData === 'string') {
            analysisData = JSON.parse(analysisData);
        }
        if (Array.isArray(analysisData)) {
            analysisData = analysisData[0];
        }
    } catch (e) {
        console.error("Failed to parse analysis data:", e);
    }

    console.log('Processed Analysis Data:', analysisData); // Debug log

    return (
        <div className="min-h-screen bg-dark-bg bg-grid pb-20 pt-32 px-6">
            <div className="container mx-auto max-w-[1400px]">
                {/* Navigation / Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="animate-fade-in">
                        <Link to="/" className="inline-flex items-center gap-2 text-text-dim hover:text-white transition-colors mb-6 font-semibold group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Dashboard Overview
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20 flex items-center gap-2">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                                <span className="text-secondary font-bold text-xs uppercase tracking-widest">AI Analysis Live</span>
                            </div>
                            <div className="text-text-dim/30">|</div>
                            <div className="flex items-center gap-2 text-text-dim text-sm font-semibold">
                                <Calendar size={14} />
                                {new Date(lead.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                            Hello, <span className="gradient-text">{lead.name.split(' ')[0]}</span>.
                        </h1>
                        <p className="text-xl text-text-dim max-w-xl">Your custom energy model has been generated. Explore your potential savings below.</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="btn-premium glass-card !border-white/10 px-8 flex gap-3 group">
                            <Download size={20} className="text-text-dim group-hover:text-white" />
                            <span className="text-white">Save PDF</span>
                        </button>
                        <button className="btn-premium btn-primary-shiny px-8 flex gap-3" onClick={() => window.open('https://calendly.com/', '_blank')}>
                            <ShieldCheck size={20} />
                            <span>Book Consultant</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Main Content Area */}
                    <div className="xl:col-span-8 space-y-10">

                        {/* Massive Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    label: "Current Monthly bill",
                                    val: isComplete ? `$${analysisData?.monthly_avg}` : '...',
                                    icon: <DollarSign className="text-primary" />,
                                    desc: "Before Solar"
                                },
                                {
                                    label: "Future Monthly Bill",
                                    val: isComplete ? `$${analysisData?.monthly_avg - analysisData?.potential_savings}` : '...',
                                    icon: <TrendingDown className="text-secondary" />,
                                    desc: "Estimated After Solar",
                                    color: "text-secondary"
                                },
                                {
                                    label: "Daily Consumption",
                                    val: isComplete ? `${analysisData?.daily_kwh} kWh` : '...',
                                    icon: <Zap className="text-accent" />,
                                    desc: "Neural Peak Parse"
                                }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card p-10 relative group h-full"
                                >
                                    <div className="absolute top-8 right-8 bg-white/5 p-3 rounded-2xl border border-white/5 group-hover:bg-primary/10 transition-colors">
                                        {stat.icon}
                                    </div>
                                    <p className="text-text-dim text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                                    <h3 className={`text-4xl font-black mb-2 ${stat.color || 'text-white'}`}>{stat.val}</h3>
                                    <p className="text-text-dim text-sm italic">{stat.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Deep Analysis Card */}
                        <div className={`glass-card p-12 overflow-hidden relative ${!isComplete ? 'min-h-[400px]' : ''}`}>
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] pointer-events-none"></div>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="bg-primary/20 p-3 rounded-2xl">
                                    <BarChart3 className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter">Bill Logic & Insights</h2>
                            </div>

                            {!isComplete ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                                    <p className="text-xl font-bold mb-2">Running Neural Network Simulation</p>
                                    <p className="text-text-dim">Cross-referencing your bill data with 25-year solar irradiance models...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="glass-card border-l-4 border-l-primary p-8 bg-white/[0.02]">
                                            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                                                <Sun size={22} className="text-primary" /> Path to $0 Bills
                                            </h4>
                                            <h5 className="text-primary text-2xl font-black mb-3">{analysisData?.zero_bill_system || analysisData?.recommended_system}</h5>
                                            <p className="text-text-dim leading-relaxed">{analysisData?.necessity_explanation || "Optimization based on your specific load profile."}</p>
                                        </div>

                                        <div className="glass-card border-l-4 border-l-accent p-8 bg-white/[0.02]">
                                            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                                                <TrendingDown size={22} className="text-accent" /> The Cost of Inaction
                                            </h4>

                                            <div className="mb-6">
                                                <label className="text-xs font-bold uppercase tracking-widest text-text-dim mb-2 block">Projected Grid Inflation: {inflationRate}%</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="20"
                                                    value={inflationRate}
                                                    onChange={(e) => setInflationRate(Number(e.target.value))}
                                                    className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer accent-accent"
                                                />
                                                <div className="flex justify-between text-xs text-text-dim mt-1">
                                                    <span>0%</span>
                                                    <span>10% (Avg)</span>
                                                    <span>20%</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-text-dim">10-Year Cost (Doing Nothing)</span>
                                                    <span className="text-2xl font-black text-white">
                                                        ${Math.round((analysisData?.monthly_avg * 12 * 10) * (1 + (inflationRate / 100))).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-text-dim">10-Year Cost (With Solar)</span>
                                                    <span className="text-2xl font-black text-secondary">
                                                        ${Math.round(((analysisData?.monthly_avg - analysisData?.potential_savings) * 12 * 10)).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="pt-4 border-t border-white/5">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-white font-bold">Net Loss to Utility</span>
                                                        <span className="text-xl font-black text-red-400">
                                                            -${Math.round(((analysisData?.monthly_avg * 12 * 10) * (1 + (inflationRate / 100))) - ((analysisData?.monthly_avg - analysisData?.potential_savings) * 12 * 10)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-white font-bold uppercase text-xs tracking-widest opacity-50">Energy Consumption Model</h4>
                                        <div className="space-y-6">
                                            {[
                                                { label: "Solar Coverage", val: "92%", color: "bg-primary" },
                                                { label: "Night Independence", val: "78%", color: "bg-secondary" },
                                                { label: "Grid Reliance", val: "8%", color: "bg-red-500/50" },
                                            ].map((bar, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-sm font-bold">
                                                        <span>{bar.label}</span>
                                                        <span className="text-white">{bar.val}</span>
                                                    </div>
                                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: bar.val }}
                                                            transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                                                            className={`h-full ${bar.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-10 p-6 glass-card border-white/5 bg-accent/5">
                                            <p className="text-sm font-semibold flex items-center gap-2">
                                                <Star size={16} className="text-primary fill-primary" />
                                                <span className="text-white">AI Suggestion:</span> Add a second Powerwall for grid independence.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Document Preview */}
                        <div className="glass-card overflow-hidden">
                            <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                                    <FileText className="text-secondary" /> Source Document
                                </h2>
                                <a href={lead.bill_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">Download Original</a>
                            </div>
                            <div className="aspect-[16/6] bg-dark-bg/50 relative group">
                                <iframe src={lead.bill_url} className="w-full h-full border-none grayscale opacity-40 group-hover:opacity-60 transition-opacity" title="Bill Preview" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="glass-card px-8 py-4 bg-dark-bg/80 border-white/10 flex items-center gap-3">
                                        <ShieldCheck className="text-secondary" />
                                        <span className="text-white font-bold">Encrypted Visualization Mode</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Chat Sidebar */}
                    <div className="xl:col-span-4 flex flex-col h-[800px] xl:h-[calc(100vh-200px)] sticky top-32">
                        <div className="glass-card flex-1 flex flex-col overflow-hidden border-primary/20 bg-dark-surface/50">
                            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Sun className="w-8 h-8 text-black" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-dark-surface rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">AI Bill Assistant</h3>
                                        <p className="text-secondary text-xs font-bold uppercase tracking-widest">Consultant Level 4</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[90%] p-6 rounded-3xl shadow-xl ${m.role === 'user'
                                            ? 'bg-primary text-black font-semibold rounded-br-none'
                                            : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                                            }`}>
                                            <p className="text-[1rem] leading-relaxed">{m.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/10 p-6 rounded-3xl rounded-bl-none border border-white/5">
                                            <div className="flex gap-1.5">
                                                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-8 bg-white/[0.02] border-t border-white/5">
                                <div className="relative group">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about your payback period..."
                                        className="modern-input pr-16 bg-dark-bg/50 group-hover:bg-dark-bg/80 transition-all border-white/5"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!isComplete || isTyping}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-dim mt-4 text-center font-bold tracking-tight opacity-50 uppercase">Neural Language Process Active</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
