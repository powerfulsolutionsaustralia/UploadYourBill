import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sun, DollarSign, Zap, MessageSquare, Send, Loader2, FileText, BarChart3, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
    id: string;
    name: string;
    email: string;
    bill_url: string;
    analysis: any;
    status: string;
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
        { role: 'assistant', content: 'Hi! I\'ve analyzed your bill. How can I help you understand your solar options today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
            // Simulate analysis if it's still 'processing'
            if (data.status === 'processing') {
                setTimeout(async () => {
                    const mockAnalysis = {
                        monthly_avg: 245,
                        daily_kwh: 22.5,
                        potential_savings: 185,
                        recommended_system: '6.6kW with 10kWh Battery',
                        roi_years: 4.2
                    };
                    await supabase.from('leads').update({ status: 'completed', analysis: mockAnalysis }).eq('id', data.id);
                    setLead({ ...data, status: 'completed', analysis: mockAnalysis });
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `Good news! I've finished the analysis. Based on your $245 monthly bill, you could save about $185/month with a 6.6kW solar system. Would you like to see the breakdown?`
                    }]);
                }, 5000);
            }
        }
        setLoading(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // Simulate AI Response (RAG simulation)
        // In a real app, you'd call a Supabase Edge Function here
        setTimeout(() => {
            let response = "That's a great question about your solar installation.";

            if (userMsg.toLowerCase().includes('cost') || userMsg.toLowerCase().includes('price')) {
                response = `Based on your bill data, a recommended 6.6kW system would typically cost between $5,000 and $7,000 after government rebates. With your current usage, it pays for itself in about 4 years.`;
            } else if (userMsg.toLowerCase().includes('battery')) {
                response = `Adding a 10kWh battery would increase your independence from the grid to about 90%. This is highly recommended for your evening peak consumption of ~12kWh.`;
            } else if (userMsg.toLowerCase().includes('roof')) {
                response = `I've checked the local solar irradiance for your area. Your orientation looks optimal for an East-West split to maximize self-consumption throughout the day.`;
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Lead Not Found</h1>
                    <a href="/" className="btn btn-primary">Go Back Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <Sun className="w-4 h-4" /> Analyzed by AI
                        </span>
                        <span className="text-text-muted">•</span>
                        <span className="text-text-muted">ID: {lead.id.substring(0, 8)}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {lead.name}</h1>
                    <p className="text-text-muted text-xl">Here is your tailored solar and energy independence roadmap.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 border-l-4 border-l-primary">
                                <div className="flex items-center gap-4 mb-4 text-text-muted">
                                    <DollarSign className="w-5 h-5" />
                                    <span className="font-semibold uppercase text-xs tracking-wider">Current Bill</span>
                                </div>
                                <div className="text-3xl font-bold">
                                    {lead.status === 'processing' ? '---' : `$${lead.analysis?.monthly_avg}/mo`}
                                </div>
                            </div>
                            <div className="glass-card p-6 border-l-4 border-l-secondary">
                                <div className="flex items-center gap-4 mb-4 text-text-muted">
                                    <TrendingDown className="w-5 h-5" />
                                    <span className="font-semibold uppercase text-xs tracking-wider">Est. Savings</span>
                                </div>
                                <div className="text-3xl font-bold text-secondary">
                                    {lead.status === 'processing' ? '---' : `-$${lead.analysis?.potential_savings}/mo`}
                                </div>
                            </div>
                            <div className="glass-card p-6 border-l-4 border-l-accent">
                                <div className="flex items-center gap-4 mb-4 text-text-muted">
                                    <Zap className="w-5 h-5" />
                                    <span className="font-semibold uppercase text-xs tracking-wider">Daily Usage</span>
                                </div>
                                <div className="text-3xl font-bold">
                                    {lead.status === 'processing' ? '---' : `${lead.analysis?.daily_kwh} kWh`}
                                </div>
                            </div>
                        </div>

                        {/* Analysis Detail */}
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-primary" /> Solar Potential Breakdown
                            </h2>

                            {lead.status === 'processing' ? (
                                <div className="py-12 text-center text-text-muted">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                                    <p>Our AI is scanning your bill and historical data...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-white/5 rounded-2xl p-6 flex items-start gap-4">
                                        <div className="bg-primary/20 p-3 rounded-xl">
                                            <Sun className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Recommended System: {lead.analysis?.recommended_system}</h4>
                                            <p className="text-text-muted">Based on your heavy morning usage, we recommend an oversized array to maximize self-consumption before 10 AM.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 flex items-start gap-4">
                                        <div className="bg-accent/20 p-3 rounded-xl">
                                            <FileText className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">ROI & Financing</h4>
                                            <p className="text-text-muted">With an estimated {lead.analysis?.roi_years} year payback period, this system is one of the highest yielding investments you can make for your property.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bill Preview */}
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-secondary" /> Uploaded Bill
                            </h2>
                            <div className="aspect-video bg-dark-lighter rounded-2xl flex items-center justify-center overflow-hidden relative">
                                <iframe src={lead.bill_url} className="w-full h-full border-none" title="Bill Preview" />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <a href={lead.bill_url} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:text-primary transition-colors">View Full Document →</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Side panel */}
                    <div className="flex flex-col h-[700px] lg:h-auto">
                        <div className="glass-card flex-1 flex flex-col overflow-hidden border-primary/20">
                            <div className="p-6 border-b border-glass-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                                    <h3 className="font-bold">Solar Assistant AI</h3>
                                </div>
                                <MessageSquare className="w-5 h-5 text-text-muted" />
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user'
                                            ? 'bg-primary text-black font-medium'
                                            : 'bg-white/10 text-white'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/10 p-4 rounded-2xl">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-6 border-t border-glass-border">
                                <div className="relative">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask about your bill..."
                                        className="input-field pr-12"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-white transition-colors">
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted mt-2 text-center">AI can make mistakes. Verify important financial data.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
