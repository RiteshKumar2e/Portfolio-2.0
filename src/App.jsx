import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import SkillsAdvanced from './components/SkillsAdvanced';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdvancedBackground from './components/3D/AdvancedBackground';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
    const [isLoading, setIsLoading] = useState(true);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        return () => clearTimeout(timer);
    }, [isLoading]);

    return (
        <ReactLenis root options={{
            lerp: 0.05,
            duration: 0.8,
            smoothTouch: false,
            wheelMultiplier: 0.8,
            touchMultiplier: 1.5,
        }}>
            <div className={`transition-colors duration-700 bg-transparent ${isDarkMode ? 'text-white' : 'text-slate-900'} selection:bg-indigo-600 selection:text-white pb-20 overflow-x-hidden`}>
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <LoadingScreen key="loader" />
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Navbar />
                            <Suspense fallback={null}>
                                <AdvancedBackground />
                            </Suspense>
                            <ScrollProgress />
                            <ScrollToTop />
                            <main className="relative z-10 w-full px-4 md:px-0">
                                <Hero />
                                <div className="space-y-40 md:space-y-72">
                                    <About />
                                    <Experience />
                                    <Projects />
                                    <SkillsAdvanced />
                                    <Achievements />
                                    <Contact />
                                </div>
                            </main>
                            <Footer />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ReactLenis>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
