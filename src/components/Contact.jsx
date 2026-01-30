import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPaperPlane, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, MapPin, CheckCircle2, AlertCircle, Rocket, Linkedin, Github } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

const Contact = () => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            // Using Formspree for direct email delivery
            // NOTE: The user should replace 'your-form-id' with their actual Formspree ID
            // For now, I'll use a placeholder that they can easily update or I'll ask.
            // But to make it work "out of the box" for them, they just need to create a form on Formspree.
            const response = await fetch('https://formspree.io/f/movwelby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#a855f7', '#3b82f6']
                });
                setFormData({ name: '', email: '', subject: '', message: '' });

                // Automatically scroll to top after a short delay
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 2000);

                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        { icon: Mail, label: 'Direct Mail', value: 'riteshkumar90359@gmail.com', link: 'mailto:riteshkumar90359@gmail.com', color: 'text-blue-500' },
        { icon: Linkedin, label: 'Professional', value: 'Ritesh Kumar', link: 'https://www.linkedin.com/in/ritesh-kumar-b5a1a0257/', color: 'text-indigo-500' },
        { icon: Github, label: 'Open Source', value: 'RiteshKumar2e', link: 'https://github.com/RiteshKumar2e', color: 'text-slate-900' },
        { icon: MapPin, label: 'Based In', value: 'Jamshedpur, India', link: null, color: 'text-rose-500' }
    ];

    return (
        <section id="contact" className={`py-12 relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
            {/* Artistic Background blobs */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60 ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`} />
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-40 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`} />

            <div className="container-custom relative z-10" ref={ref}>
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left Side: Text Content */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-4 px-1">Transmission Channel</h4>
                            <h2 className={`text-6xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Let's build the <br /> <span className="text-gradient">Next Gen</span>
                            </h2>
                            <p className={`text-xl font-medium leading-relaxed max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                I'm excited to hear about your projects and ideas. Whether it's AI, Full-Stack, or anything tech, let's make it real.
                            </p>
                            <div className="h-1 w-20 bg-indigo-600 rounded-full mt-10" />
                        </motion.div>
                    </div>

                    {/* Right Side: Modern Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative w-full"
                    >
                        {/* Decorative background for form */}
                        <div className={`absolute -inset-4 rounded-[50px] -z-10 blur-2xl opacity-50 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-gradient-to-tr from-indigo-50 to-purple-50'}`} />

                        <div className={`p-8 md:p-12 rounded-[48px] border transition-all duration-500 ${isDarkMode ? 'bg-slate-900/40 border-white/10 cyber-card-glow' : 'bg-white border-slate-200 shadow-2xl shadow-indigo-100/50'}`}>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Identity</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className={`w-full px-8 py-5 rounded-3xl border transition-all font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none ${isDarkMode ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'}`}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="hello@example.com"
                                            className={`w-full px-8 py-5 rounded-3xl border transition-all font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none ${isDarkMode ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Project Inquiry / Job Opportunity"
                                        className={`w-full px-8 py-5 rounded-3xl border transition-all font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none ${isDarkMode ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'}`}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Message Transmission</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder="What's on your mind?"
                                        className={`w-full px-8 py-5 rounded-3xl border transition-all font-bold resize-none focus:ring-4 focus:ring-indigo-500/10 outline-none ${isDarkMode ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'}`}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className={`w-full py-6 rounded-3xl text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-xl ${status === 'sending' ? (isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400') :
                                        status === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                            status === 'error' ? 'bg-rose-500 text-white shadow-rose-500/30' :
                                                (isDarkMode ? 'bg-white text-slate-900 hover:bg-indigo-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-900/10')
                                        }`}
                                    whileHover={status === 'idle' ? { y: -5 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <AnimatePresence mode="wait">
                                        {status === 'sending' && (
                                            <motion.div
                                                key="sending"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="w-5 h-5 border-3 border-slate-300 border-t-indigo-600 rounded-full animate-spin"
                                            />
                                        )}
                                        {status === 'success' && (
                                            <motion.div
                                                key="success"
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <CheckCircle2 size={18} /> Transmitted Successfully
                                            </motion.div>
                                        )}
                                        {status === 'error' && (
                                            <motion.div
                                                key="error"
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <AlertCircle size={18} /> Transmission Failed
                                            </motion.div>
                                        )}
                                        {status === 'idle' && (
                                            <motion.div
                                                key="idle"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="flex items-center gap-3"
                                            >
                                                Initiate Transmission <FaPaperPlane className="text-xs" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
