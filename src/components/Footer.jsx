import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaChevronRight } from 'react-icons/fa';
import { SiOrcid } from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';
import { useLenis } from '@studio-freight/react-lenis';

const Footer = () => {
    const { isDarkMode } = useTheme();
    const lenis = useLenis();
    const currentYear = new Date().getFullYear();

    const scrollToSection = (href) => {
        const element = document.querySelector(href);
        if (element) {
            if (lenis) {
                lenis.start();
                lenis.scrollTo(element, { offset: -80, duration: 0.6 });
            } else {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            // Prevent URL hash from showing
            window.history.replaceState(null, null, window.location.pathname);
        }
    };

    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Skills', href: '#skills' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    const socialLinks = [
        { icon: FaGithub, href: 'https://github.com/RiteshKumar2e', label: 'GitHub', color: 'bg-slate-50 text-slate-800 hover:bg-slate-100' },
        { icon: FaLinkedin, href: 'https://www.linkedin.com/in/riteshkumar-tech', label: 'LinkedIn', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
        { icon: FaEnvelope, href: 'mailto:riteshkumar90359@gmail.com', label: 'Email', color: 'bg-rose-50 text-rose-500 hover:bg-rose-100' },
        { icon: SiOrcid, href: 'https://orcid.org/0009-0009-0057-6839', label: 'ORCID', color: 'bg-lime-50 text-[#A6CE39] hover:bg-lime-100' },
    ];

    return (
        <footer className={`relative border-t transition-colors duration-700 ${isDarkMode ? 'bg-transparent border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="container-custom py-12">
                <div className="grid md:grid-cols-3 gap-10 mb-10">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <button
                            onClick={() => scrollToSection('#home')}
                            className="cursor-pointer"
                        >
                            <h3 className={`text-3xl font-black mb-6 ${isDarkMode ? 'text-white text-glow' : 'gradient-text'}`}>Ritesh.</h3>
                        </button>
                        <p className={`font-medium leading-relaxed mb-8 max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Architecting the future of web and AI through clean code and innovative design.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm border ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-indigo-500/50' : `border-slate-50 ${social.color}`}`}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-8 ml-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Navigation</h4>
                        <ul className="grid grid-cols-2 gap-y-4 gap-x-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection(link.href);
                                        }}
                                        className={`font-bold text-sm flex items-center gap-2 group transition-colors cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}
                                        whileHover={{ x: 5 }}
                                    >
                                        <FaChevronRight className="text-[10px] opacity-0 group-hover:opacity-100 transition-all text-indigo-400" />
                                        {link.name}
                                    </motion.button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-8 ml-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Connect</h4>
                        <div className="space-y-4">
                            <a href="mailto:riteshkumar90359@gmail.com" className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all shadow-sm ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-indigo-500/30' : 'bg-slate-50 border-transparent hover:border-indigo-100 hover:bg-white'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? 'bg-slate-900 text-indigo-400 border-white/5' : 'bg-white text-indigo-600 border-slate-100'}`}>
                                    <FaEnvelope />
                                </div>
                                <span className={`text-sm font-black truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>riteshkumar90359@gmail.com</span>
                            </a>
                            <a href="https://www.linkedin.com/in/riteshkumar-tech" target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all shadow-sm ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30' : 'bg-slate-50 border-transparent hover:border-blue-100 hover:bg-white'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? 'bg-slate-900 text-blue-400 border-white/5' : 'bg-white text-blue-600 border-slate-100'}`}>
                                    <FaLinkedin />
                                </div>
                                <span className={`text-sm font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>LinkedIn Profile</span>
                            </a>
                            <a href="https://orcid.org/0009-0009-0057-6839" target="_blank" rel="noopener noreferrer" className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all shadow-sm ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-lime-500/30' : 'bg-slate-50 border-transparent hover:border-lime-100 hover:bg-white'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${isDarkMode ? 'bg-slate-900 text-[#A6CE39] border-white/5' : 'bg-white text-[#A6CE39] border-slate-100'}`}>
                                    <SiOrcid />
                                </div>
                                <span className={`text-sm font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ORCID Profile</span>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Divider Line */}
                <div className={`h-px mb-8 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`} />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center md:text-left">
                        © {currentYear} Ritesh Kumar. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Handcrafted with
                        <motion.span
                            className="text-rose-500 inline-block"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaHeart />
                        </motion.span>
                        by the developer
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
