import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { Upload, Loader2, CheckCircle2, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Phone number is required'),
});

type FormData = z.infer<typeof schema>;

export const LeadForm: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        if (!file) {
            alert('Please upload your electricity bill');
            return;
        }

        setIsSubmitting(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `user-bills/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('bills')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('bills')
                .getPublicUrl(filePath);

            const slug = Math.random().toString(36).substring(7);

            const { error: dbError } = await supabase
                .from('leads')
                .insert([{
                    ...data,
                    bill_url: publicUrl,
                    slug,
                    status: 'processing'
                }]);

            if (dbError) throw dbError;

            // Trigger AI Analysis
            const { data: leadData } = await supabase
                .from('leads')
                .select('id')
                .eq('slug', slug)
                .single();

            if (leadData) {
                await supabase.functions.invoke('analyze-bill', {
                    body: { lead_id: leadData.id, bill_url: publicUrl }
                });
            }

            setIsSuccess(true);

            setTimeout(() => {
                window.location.href = `/bill/${slug}`;
            }, 2500);

        } catch (error) {
            console.error('Error:', error);
            alert('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-10 md:p-14 max-w-xl w-full relative overflow-hidden group">
            {/* Decorative light effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>

            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        key="form"
                        className="relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-primary font-bold text-sm tracking-widest uppercase">Secured Submission</span>
                        </div>

                        <h2 className="text-4xl font-extrabold mb-3 gradient-text">Start Your Analysis</h2>
                        <p className="text-text-dim mb-10 text-lg">Instant ROI calculation using AI bill parsing.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                                    <User size={18} />
                                </div>
                                <input
                                    {...register('name')}
                                    className="modern-input pl-12 input-with-icon"
                                    placeholder="Full Name"
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-2 ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        {...register('email')}
                                        className="modern-input pl-12 input-with-icon"
                                        placeholder="Email Address"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-2 ml-1">{errors.email.message}</p>}
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        {...register('phone')}
                                        className="modern-input pl-12 input-with-icon"
                                        placeholder="Phone Number"
                                    />
                                    {errors.phone && <p className="text-red-400 text-xs mt-2 ml-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-text-dim ml-1">Electricity Bill (Latest)</p>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer group/upload ${file ? 'border-secondary bg-secondary/5' : 'border-glass-border hover:border-primary hover:bg-white/5'}`}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        hidden
                                        accept=".pdf,image/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center animate-fade-in">
                                            <div className="bg-secondary/20 p-4 rounded-full mb-4">
                                                <CheckCircle2 className="w-8 h-8 text-secondary" />
                                            </div>
                                            <p className="font-bold text-secondary text-lg">{file.name}</p>
                                            <button type="button" className="text-xs text-text-dim mt-3 hover:text-white underline underline-offset-4" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Replace file</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center group-hover/upload:scale-105 transition-transform duration-300">
                                            <div className="bg-white/5 p-4 rounded-full mb-4 group-hover/upload:bg-primary/10 transition-colors">
                                                <Upload className="w-8 h-8 text-text-dim group-hover/upload:text-primary" />
                                            </div>
                                            <p className="font-bold text-lg mb-1">Click to Upload Bill</p>
                                            <p className="text-sm text-text-dim">PDF, JPG or PNG (Max 10MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-premium btn-primary-shiny w-full py-5 text-xl"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                        Analyzing Data...
                                    </>
                                ) : (
                                    'Generate Solar Plan'
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                        key="success"
                    >
                        <div className="relative inline-block mb-10">
                            <div className="absolute inset-0 bg-secondary blur-3xl opacity-20"></div>
                            <CheckCircle2 className="w-24 h-24 text-secondary relative z-10" />
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4 gradient-text">Analysis Initialized</h2>
                        <p className="text-text-dim text-xl max-w-sm mx-auto">
                            Our AI is currently decrypting your bill data to find the biggest savings.
                        </p>
                        <div className="mt-14 space-y-4">
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2.5 }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            <p className="text-xs text-primary font-bold tracking-widest uppercase animate-pulse">Redirecting to Dashboard...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
