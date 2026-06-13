import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useLenis } from '@studio-freight/react-lenis';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { isDarkMode, toggleTheme } = useTheme();
    const navRef = useRef(null);

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Achievements', href: '#achievements' },
        { name: 'Contact', href: '#contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            const sections = navItems.map(item => item.href.substring(1));
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });

            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const links = document.querySelectorAll('.nav-link-magnetic');
        links.forEach(link => {
            const handleMouseMove = (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(link, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            };

            const handleMouseLeave = () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            };

            link.addEventListener('mousemove', handleMouseMove);
            link.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                link.removeEventListener('mousemove', handleMouseMove);
                link.removeEventListener('mouseleave', handleMouseLeave);
            };
        });
    }, []);

    const lenis = useLenis();

    const scrollToSection = (href) => {
        const element = document.querySelector(href);
        if (element) {
            if (lenis) {
                lenis.start(); // Ensure scrolling is enabled
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
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        } else {
            document.body.style.overflow = 'unset';
            if (lenis) lenis.start();
        }
        return () => {
            document.body.style.overflow = 'unset';
            if (lenis) lenis.start();
        };
    }, [isMobileMenuOpen, lenis]);

    return (
        <>
            <motion.nav
                ref={navRef}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-[1000] pointer-events-auto transition-all duration-300 ${isMobileMenuOpen
                    ? 'opacity-0 pointer-events-none' // Hide navbar when menu is open to avoid double buttons
                    : isScrolled
                        ? isDarkMode
                            ? 'py-4 bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-white/5'
                            : 'py-4 bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-100'
                        : 'py-6 bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <motion.a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('#home');
                            }}
                            className="flex items-center gap-0 group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                        >
                            <span className="text-2xl font-black text-indigo-600 tracking-tighter">R</span>
                            <span className={`text-2xl font-black tracking-tighter transition-colors group-hover:text-indigo-600 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>itesh</span>
                            <span className="text-2xl font-black text-indigo-600">.</span>
                        </motion.a>

                        {/* Desktop Navigation */}
                        <div className={`hidden md:flex items-center gap-2 p-1 rounded-2xl border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-900/5 border-slate-200'}`}>
                            {navItems.map((item) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.href);
                                    }}
                                    className={`nav-link-magnetic px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 relative tracking-wide ${activeSection === item.href.substring(1)
                                        ? isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {activeSection === item.href.substring(1) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className={`absolute inset-0 rounded-xl -z-10 border ${isDarkMode
                                                ? 'bg-indigo-500/15 border-indigo-500/25'
                                                : 'bg-white border-slate-200 shadow-sm'}`}
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Theme Toggle Button */}
                            <motion.button
                                onClick={toggleTheme}
                                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>

                            {/* Contact Button */}
                            <div className="hidden md:block">
                                <motion.button
                                    onClick={() => scrollToSection('#contact')}
                                    className={`px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-lg tracking-tight ${isDarkMode
                                        ? 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-[1.02]'
                                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-500/30'}`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Let's Talk
                                </motion.button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className={`md:hidden w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay - Redesigned for Professionalism */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[20000] md:hidden overflow-hidden"
                    >
                        {/* Backdrop Blur Layer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 backdrop-blur-3xl ${isDarkMode ? 'bg-slate-950/80' : 'bg-white/80'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Content Drawer */}
                        <motion.div
                            initial={{ x: '100% ' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100% ' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`absolute inset-y-0 right-0 w-[75%] max-w-[280px] shadow-2xl flex flex-col ${isDarkMode ? 'bg-slate-900 border-l border-white/5' : 'bg-white border-l border-slate-100'}`}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0 pointer-events-none opacity-10">
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
                                <div className="absolute inset-0 bg-grid opacity-10" />
                            </div>

                            {/* Header Section */}
                            <div className="relative flex items-center justify-between p-5 border-b border-white/5">
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-0"
                                >
                                    <span className="text-xl font-black text-indigo-600 tracking-tighter">R</span>
                                    <span className={`text-xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>itesh.</span>
                                </motion.div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-900/5 text-slate-600'}`}
                                >
                                    <FaTimes />
                                </motion.button>
                            </div>

                            {/* Navigation Items */}
                            <div className="relative flex-1 flex flex-col py-6 px-4 overflow-y-auto">
                                <div className="flex flex-col gap-1">
                                    {navItems.map((item, index) => (
                                        <motion.a
                                            key={item.name}
                                            href={item.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection(item.href);
                                            }}
                                            className={`relative py-4 px-5 flex items-center rounded-xl transition-all active:scale-[0.98] border ${activeSection === item.href.substring(1)
                                                ? isDarkMode
                                                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                                                    : 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                                                : isDarkMode ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/5' : 'text-slate-600 border-transparent hover:bg-slate-50'
                                                }`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">{item.name}</span>


                                            {activeSection === item.href.substring(1) && (
                                                <motion.div
                                                    layoutId="mobile-nav-dot"
                                                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                                                />
                                            )}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Section - Simplified */}
                            <div className="relative p-6 border-t border-white/5 mt-auto">
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    © {new Date().getFullYear()} Ritesh Portfolio
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
