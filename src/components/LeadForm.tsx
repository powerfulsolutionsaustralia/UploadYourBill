import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
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
            // 1. Upload the file to Supabase Storage
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

            // 2. Create a slug for the dedicated landing page
            const slug = Math.random().toString(36).substring(7);

            // 3. Save lead data to the database
            const { error: dbError } = await supabase
                .from('leads')
                .insert([{
                    ...data,
                    bill_url: publicUrl,
                    slug,
                    status: 'processing'
                }]);

            if (dbError) throw dbError;

            // 4. Trigger AI Analysis (Edge Function)
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

            // Redirect to the dedicated landing page after a short delay
            setTimeout(() => {
                window.location.href = `/bill/${slug}`;
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-8 md:p-12 max-w-xl w-full">
            <AnimatePresence mode="wait">
                {!isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="form"
                    >
                        <h2 className="text-3xl font-bold mb-6">Get Your Solar Analysis</h2>
                        <p className="text-text-muted mb-8">Upload your bill and our AI will calculate your potential savings and build your custom solar solution.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    {...register('name')}
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Email Address</label>
                                    <input
                                        {...register('email')}
                                        className="input-field"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        {...register('phone')}
                                        className="input-field"
                                        placeholder="+61 400 000 000"
                                    />
                                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="label">Upload Electricity Bill (PDF or Image)</label>
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${file ? 'border-secondary bg-secondary/10' : 'border-glass-border hover:border-primary'}`}
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
                                        <div className="flex flex-col items-center">
                                            <CheckCircle2 className="w-12 h-12 text-secondary mb-2" />
                                            <p className="font-semibold text-secondary">{file.name}</p>
                                            <button type="button" className="text-sm text-text-muted mt-2 hover:text-white" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Change file</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-12 h-12 text-primary mb-2" />
                                            <p className="font-semibold">Click or drag to upload</p>
                                            <p className="text-sm text-text-muted">Maximum file size 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-4 text-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing Bill...
                                    </>
                                ) : (
                                    'Generate My Free Solar Plan'
                                )}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                        key="success"
                    >
                        <CheckCircle2 className="w-20 h-20 text-secondary mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Submission Complete!</h2>
                        <p className="text-text-muted text-lg">
                            We've received your bill. Our AI is now crafting your personalized solar & battery plan.
                        </p>
                        <div className="mt-8">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                            <p className="text-sm mt-2 text-text-muted">Preparing your landing page...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
