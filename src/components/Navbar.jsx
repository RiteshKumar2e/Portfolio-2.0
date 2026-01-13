import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';

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

    const scrollToSection = (href) => {
        const element = document.querySelector(href);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <motion.nav
            ref={navRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-[1000] pointer-events-auto transition-all duration-300 ${isScrolled
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
                                className={`nav-link-magnetic px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 relative ${activeSection === item.href.substring(1)
                                    ? 'text-indigo-600'
                                    : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {activeSection === item.href.substring(1) && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className={`absolute inset-0 rounded-xl shadow-sm -z-10 ${isDarkMode ? 'bg-white/10' : 'bg-white'}`}
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${isDarkMode ? 'bg-white text-slate-900 hover:bg-indigo-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
                                whileHover={{ scale: 1.05 }}
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed inset-0 z-[1100] md:hidden backdrop-blur-2xl transition-colors duration-700 ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'}`}
                    >
                        {/* Close Button Header */}
                        <div className="flex items-center justify-between p-8">
                            <motion.a
                                href="#home"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('#home');
                                }}
                                className="flex items-center gap-0"
                            >
                                <span className="text-3xl font-black text-indigo-600 tracking-tighter">R</span>
                                <span className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>itesh.</span>
                            </motion.a>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-colors ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-900/5 text-slate-900'}`}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col items-center justify-center gap-6 h-[60%] px-8">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.href);
                                    }}
                                    className={`text-4xl font-black tracking-tighter transition-all hover:scale-110 ${activeSection === item.href.substring(1)
                                        ? 'text-indigo-600'
                                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>

                        {/* Footer area in Mobile Menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-16 left-0 right-0 px-12"
                        >
                            <div className="flex flex-col items-center gap-8">
                                <button
                                    onClick={() => scrollToSection('#contact')}
                                    className={`w-full py-6 rounded-3xl text-lg font-black uppercase tracking-widest transition-all shadow-xl ${isDarkMode ? 'bg-white text-slate-900 shadow-white/5' : 'bg-slate-900 text-white shadow-slate-900/10'}`}
                                >
                                    Let's Talk
                                </button>
                                <div className="flex gap-6">
                                    <span className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Connect:</span>
                                    <div className="flex gap-4">
                                        <FaGithub className={`text-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                                        <FaLinkedin className="text-2xl text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
