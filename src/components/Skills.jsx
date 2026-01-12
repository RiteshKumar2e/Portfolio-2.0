import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaGitAlt, FaDocker } from 'react-icons/fa';
import { SiTensorflow, SiMongodb, SiJavascript, SiTailwindcss, SiExpress, SiPostgresql } from 'react-icons/si';

const Skills = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const skillCategories = [
        {
            title: 'Frontend Development',
            skills: [
                { name: 'React.js', icon: FaReact, color: '#61DAFB' },
                { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
                { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
            ]
        },
        {
            title: 'Backend Development',
            skills: [
                { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
                { name: 'Express.js', icon: SiExpress, color: '#000000' },
                { name: 'Python', icon: FaPython, color: '#3776AB' },
            ]
        },
        {
            title: 'Database & Tools',
            skills: [
                { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
                { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
                { name: 'Git', icon: FaGitAlt, color: '#F05032' },
            ]
        },
        {
            title: 'AI & ML',
            skills: [
                { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
                { name: 'Python', icon: FaPython, color: '#3776AB' },
                { name: 'Data Science', icon: FaDatabase, color: '#667eea' },
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <section id="skills" className="section-container bg-black/20">
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text"
                >
                    Skills & Technologies
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skillCategories.map((category, categoryIndex) => (
                        <motion.div
                            key={categoryIndex}
                            variants={itemVariants}
                            className="glass-effect rounded-2xl p-6 card-3d hover:shadow-2xl hover:shadow-primary/20"
                            whileHover={{ y: -10 }}
                        >
                            <h3 className="text-xl font-bold mb-6 text-center gradient-text">
                                {category.title}
                            </h3>
                            <div className="space-y-4">
                                {category.skills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skillIndex}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                                        whileHover={{ x: 10, scale: 1.05 }}
                                    >
                                        <skill.icon
                                            className="text-3xl"
                                            style={{ color: skill.color }}
                                        />
                                        <span className="font-medium">{skill.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Skills;
