import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    SiReact, SiJavascript, SiNodedotjs, SiMongodb, SiHtml5, SiCss,
    SiPython, SiTensorflow, SiCplusplus, SiPytorch, SiPandas, SiNumpy,
    SiMysql, SiGit, SiGithub, SiGooglecloud, SiJupyter, SiOpencv,
    SiExpress, SiScikitlearn, SiKeras, SiFastapi, SiPostgresql,
    SiJsonwebtokens, SiSqlalchemy, SiPydantic, SiPlotly, SiHuggingface,
    SiGooglegemini
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import {
    FaLaptopCode, FaServer, FaDatabase, FaBrain, FaTools, FaCloud,
    FaCodeBranch, FaCube, FaGlobe, FaShapes, FaLayerGroup, FaTimes, FaArrowRight,
    FaArrowLeft, FaGithub as FaGithubBrand, FaExternalLinkAlt,
    FaRobot, FaEye, FaLanguage, FaNetworkWired, FaChartLine, FaChartBar, FaTree, FaSitemap
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

// Deep, human-written case studies — one per real project. Written so both a
// technical reviewer and a non-technical reader can follow exactly what was
// built and why. Keys must match the `project` names used in each skill's `usedIn`.
const projectDetails = {
    "Community AI Platform": {
        role: "Full-Stack Developer",
        code: "https://github.com/RiteshKumar2e/Community-Empowering-2.0",
        live: "https://communityai.co.in",
        summary: "Imagine one friendly website that tells people exactly which government schemes and opportunities they qualify for — and talks to them in their own language. That is what this platform does for communities that usually miss out because the information is scattered and hard to read.",
        steps: [
            { title: "Understanding the real problem", text: "Government help often exists, but people never find it: details are spread across dozens of sites, written in complex English, and buried inside PDFs. I started by mapping what an ordinary user actually needs — 'what am I eligible for, and how do I get it?' — and designed the entire product around answering that one question simply." },
            { title: "Building a solid backend with FastAPI", text: "I chose FastAPI, a modern Python framework, because it is fast and can serve many users at once using asynchronous requests. Think of it as the engine room: it receives every request from the website, runs the logic, and sends an answer back in milliseconds." },
            { title: "Modelling data safely (SQLAlchemy + Pydantic)", text: "I used SQLAlchemy to design the database — tables for users, schemes, and chat history — without writing risky raw SQL. Pydantic validates every incoming request, so malformed or malicious data is rejected before it ever reaches the database." },
            { title: "Locking the doors with JWT", text: "When a user logs in, the server hands them a secure digital token (a JWT). Every time they open a private page, the server checks that token. In plain terms, it is a tamper-proof wristband that proves who you are, so nobody can peek at someone else's information." },
            { title: "A multilingual AI assistant", text: "The centrepiece is a chat assistant that understands context and replies in the user's own language. Someone can simply type 'mujhe kya madad mil sakti hai?' and get a clear, friendly answer instead of scrolling through confusing forms." },
            { title: "Smart recommendations with deep learning", text: "Instead of forcing people to search, a deep-learning model studies their profile and surfaces the opportunities most relevant to them — like a helpful friend who already knows all the rules." },
            { title: "The React frontend and going live", text: "I built a clean, responsive interface in React so it runs smoothly even on a budget phone, then deployed it to production at communityai.co.in, where it is live and serving real users today." }
        ]
    },
    "QuickFix AI Customer Agent": {
        role: "Solo Developer",
        code: "https://github.com/RiteshKumar2e/customer-complaint-agent_new",
        live: "https://riteshkr.online",
        summary: "Picture the best customer-support person you have ever dealt with — fast, patient, and always right. Now imagine thirty of them, each an expert in one topic, answering instantly. That is QuickFix: a team of AI agents that resolves complaints in under a second.",
        steps: [
            { title: "The everyday frustration", text: "When you complain to a company, you wait on hold, repeat yourself, and often get different answers from different people. I set out to make support that is instant, consistent, and genuinely kind, no matter how unusual the problem is." },
            { title: "A team of 30+ specialist agents", text: "Instead of one giant AI trying to know everything, I built more than thirty smaller AI agents, each specialised in one area — refunds, delivery, billing, and so on. The system reads your complaint and routes it to the right expert, exactly like a well-run call centre." },
            { title: "Teaching the AI the rulebook with RAG", text: "RAG (Retrieval-Augmented Generation) means the AI first looks up the company's actual policy documents and then answers based on them. In simple terms, it 'reads the manual' before it speaks, so it gives correct, policy-backed answers instead of guessing." },
            { title: "Choosing fast, smart brains", text: "I connected the agents to Gemini 2.0 and Groq's LLaMA models, which understand language extremely well and respond at very high speed — the key to those sub-second replies." },
            { title: "The backend and its memory", text: "A FastAPI backend orchestrates all the agents, and a MariaDB database stores every complaint and its history, so the system remembers context and stays consistent across a whole conversation." },
            { title: "A real-time React console", text: "I built the interface in React 19, where a customer types a problem and watches a clear, empathetic resolution appear almost instantly on screen." },
            { title: "The outcome", text: "The result is support that is available 24/7, never tired, and consistent — sub-second resolutions across a huge range of tricky, policy-heavy cases." }
        ]
    },
    "Steel Surface Defect Detection": {
        role: "ML Research · NIT Jamshedpur",
        code: "https://github.com/RiteshKumar2e/Steel_Surface_Defect",
        live: "",
        summary: "On a steel production line, tiny scratches and cracks can ruin a whole batch — but humans inspecting fast-moving sheets get tired and miss things. I built an AI 'inspector' that watches the surface and flags defects automatically, with 98.33% accuracy.",
        steps: [
            { title: "Why this matters", text: "Manual quality control is slow, costly, and inconsistent. A model that spots defects reliably saves money and prevents faulty steel from ever shipping. This was a research project carried out at NIT Jamshedpur." },
            { title: "Preparing the images with OpenCV", text: "I used OpenCV to clean and standardise thousands of steel-surface images — adjusting size, contrast, and lighting — so the model always sees clear, consistent examples to learn from." },
            { title: "Picking a lightweight 'brain' (MobileNetV2)", text: "Factories need models that run on small, cheap hardware right next to the camera, not just on powerful servers. I chose MobileNetV2 as the backbone because it is accurate yet light enough to run on edge devices." },
            { title: "Seeing defects of every size (FPN + attention fusion)", text: "Defects range from large blotches to hairline cracks. I added a Feature Pyramid Network and attention-based multi-scale feature fusion — my AMFF-CNN design — so the model examines the image at several zoom levels and focuses on the parts that actually matter." },
            { title: "Training the model in PyTorch", text: "Using PyTorch, I trained the network on the labelled images, repeatedly adjusting it until it learned to tell a genuine defect apart from a harmless mark or reflection." },
            { title: "Measuring success", text: "I validated it carefully and reached 98.33% accuracy and a 0.85 mAP score — strong, trustworthy numbers for real industrial use." },
            { title: "Ready for the real world", text: "The final model is light enough to be deployed on the edge, right beside the production line, for instant, around-the-clock quality checks." }
        ]
    },
    "Age Gender Prediction": {
        role: "Solo Developer",
        code: "https://github.com/RiteshKumar2e/AGE_GENDER_PREDECTION",
        live: "",
        summary: "Point a webcam at a face and, in real time, the app estimates the person's age range and gender. It is a small but complete demonstration of computer vision working live, frame by frame.",
        steps: [
            { title: "The goal", text: "Biometric and analytics systems often need quick age and gender estimates straight from a live camera. I wanted a working, real-time demonstration of that idea — not just a result hidden inside a notebook." },
            { title: "Finding the face first", text: "Before predicting anything, the app has to locate the face in each video frame. I used a Haarcascade classifier — a classic, very fast face detector — to draw a box around the face so the model knows exactly where to look." },
            { title: "The prediction model", text: "I built and trained a Convolutional Neural Network (CNN) in PyTorch. Once the face is cropped out, the CNN studies it and predicts the most likely age range and gender." },
            { title: "Making it real-time", text: "The tricky part is doing all of this fast enough to feel instant. I optimised the loop so every camera frame is detected and predicted on the fly, with the results drawn directly onto the live video stream." },
            { title: "Computer vision end to end", text: "From capturing the camera feed to displaying labels on screen, the whole pipeline is a hands-on example of deep learning and computer vision working together in real time." },
            { title: "What I learned", text: "Building this taught me to balance speed against accuracy, to cope with different lighting and angles, and — most importantly — to turn a trained model into something that runs smoothly for a real user rather than only on test data." }
        ]
    },
    "Combat Online Plagiarism": {
        role: "Solo Developer",
        code: "https://github.com/RiteshKumar2e/Combat-Online-Plagiarism-with-AI",
        live: "",
        summary: "Most plagiarism checkers only catch text that is copied word-for-word. But people cheat by rewording. This tool understands meaning, not just words, so it catches paraphrased copying too.",
        steps: [
            { title: "The loophole", text: "Traditional checkers compare text literally, so simply swapping a few words ('big' becomes 'large') is enough to fool them. I wanted a checker that understands what a sentence actually means, not just the letters in it." },
            { title: "Turning words into meaning", text: "Using NLP and Transformer models, I convert each piece of text into an embedding — a list of numbers that captures its meaning. Two sentences that say the same thing in different words end up with very similar numbers." },
            { title: "Comparing meaning with cosine similarity", text: "I measure how close two embeddings are using cosine similarity. In plain terms, it scores how 'aligned' two ideas are, on a scale from 0 (unrelated) to 1 (essentially identical)." },
            { title: "Flagging the copies", text: "If two documents score very high on similarity — even when the wording is completely different — the system flags them as likely plagiarism for a human to review." },
            { title: "Why it is better", text: "This meaning-based approach catches the sneaky, reworded cases that literal matching always misses, which makes it far more useful for teachers, editors, and reviewers." },
            { title: "The bigger lesson", text: "The project showed me how modern AI represents language as numbers, and how a simple, well-chosen maths comparison on top of those numbers can solve a problem that exact text-matching never could." }
        ]
    },
    "Sentiment Analysis Pipeline": {
        role: "Solo Developer",
        code: "https://github.com/RiteshKumar2e/Sentiment-Analysis",
        live: "",
        summary: "Reading thousands of reviews or tweets by hand is impossible. This pipeline reads them for you, scores the mood of each one, and turns the results into clear, interactive charts that anyone can understand.",
        steps: [
            { title: "The problem", text: "Businesses are flooded with written feedback. They do not just need a single number; they need to see the overall mood at a glance and understand why it is shifting." },
            { title: "Scoring the mood with VADER", text: "I used VADER, a tool tuned for everyday language — including slang and emojis — to score each piece of text as positive, negative, or neutral, with no heavy model training required." },
            { title: "An automated pipeline", text: "I built an end-to-end flow that ingests the text, cleans it, scores it, and organises the results — all automatically and at high speed, so even large batches are processed quickly." },
            { title: "Making it visual with Plotly", text: "Numbers alone are hard to read, so I added interactive Plotly charts. Now anyone, technical or not, can hover, filter, and instantly see whether sentiment is trending up or down." },
            { title: "The payoff", text: "It turns a mountain of raw opinions into a clear story that a decision-maker can act on in seconds instead of days." },
            { title: "Why this design", text: "By combining a fast, reliable scorer with strong visualisation, the tool stays simple to run yet genuinely useful — proof that the right pipeline matters as much as the model itself." }
        ]
    },
    "Black Friday Sales Model": {
        role: "Solo Developer",
        code: "https://github.com/RiteshKumar2e/Black-Friday-Sales-Prediction",
        live: "",
        summary: "Before a big sale, shops must guess how much each customer will spend so they can stock the right products and target the right offers. This model predicts that spending from past sales data.",
        steps: [
            { title: "The business question", text: "Retailers lose money two ways: too much stock that never sells, or too little when demand suddenly spikes. The key to avoiding both is forecasting customer spending in advance." },
            { title: "Preparing the data with Pandas", text: "Real sales data is messy. I used Pandas to clean it and engineer features — turning raw records such as age, product category, and past purchases into clear signals a model can learn from." },
            { title: "Training boosting models (XGBoost & LightGBM)", text: "I used XGBoost and LightGBM, two powerful gradient-boosting techniques. In simple terms, they build many small decision-makers that each fix the previous one's mistakes, combining into one very accurate predictor." },
            { title: "Forecasting spend", text: "The trained model predicts how much a given customer is likely to spend, which helps the business plan inventory and personalise its campaigns ahead of the rush." },
            { title: "Why these models", text: "Boosting models are a favourite in data competitions because they handle complex patterns in tabular data extremely well — which makes them a natural fit for this kind of forecasting." },
            { title: "The takeaway", text: "This project tied together the full data-science workflow — cleaning, feature engineering, modelling, and evaluation — to answer a concrete, money-saving business question." }
        ]
    },
    "This Portfolio": {
        role: "Designer & Developer",
        code: "https://github.com/RiteshKumar2e",
        live: "https://riteshkr.info",
        summary: "The site you are on right now. I designed and built it to feel fast, modern, and alive — with 3D graphics, smooth motion, and interactive touches like this very pop-up.",
        steps: [
            { title: "The goal", text: "A portfolio should load fast, work on any device, and be memorable. I wanted something that demonstrates my front-end skill the moment you arrive, instead of just describing it." },
            { title: "Foundation: React + Vite", text: "I built it as a React application using Vite, which gives near-instant development feedback and a highly optimised final build. Everything on the page is broken into small, reusable components." },
            { title: "Styling with Tailwind CSS", text: "I used Tailwind CSS for a consistent design system, full responsiveness, and the dark/light theme you can toggle at the top of the page." },
            { title: "Motion with Framer Motion & GSAP", text: "Framer Motion powers the entry animations and this modal, while GSAP drives the scroll-triggered reveals, so each section gracefully fades into view as you scroll down." },
            { title: "3D with React Three Fiber", text: "The floating particle background and hero visuals are genuine 3D, rendered with React Three Fiber and Three.js, adding depth without slowing the page down." },
            { title: "This interactive skill explorer", text: "The pop-up you are reading is itself a feature: click a skill, see where I used it, then click a project for the full story — all built to make my experience easy and enjoyable to explore." }
        ]
    },
    "SOEIT Achievement Portal": {
        role: "Full-Stack Developer",
        code: "https://github.com/RiteshKumar2e/SOEIT-Acheivement-portal",
        live: "https://soeit-acheivement-portal.vercel.app",
        summary: "Imagine a college where every student's achievements are scattered across emails, spreadsheets, and paperwork. SOEIT brings everything together into one platform where students can showcase their achievements and faculty can review, verify, and manage them with ease.",
        steps: [
            {
            title: "The everyday challenge",
            text: "Managing student achievements manually is slow, repetitive, and prone to errors. Students often struggle to keep track of their certificates, while faculty spend hours verifying and organizing records."
        },
        {
            title: "A centralized achievement platform",
            text: "I built a web application where students can submit academic, technical, sports, and extracurricular achievements in one place. Every submission follows a structured workflow, making records easy to manage."
        },
        {
            title: "Role-based access for everyone",
            text: "Different users have different responsibilities. Students can upload and monitor their achievements, faculty members can verify submissions, and administrators have complete control over managing users and records."
        },
        {
            title: "Fast and responsive experience",
            text: "The frontend is built with React, providing a clean and responsive interface that makes navigation simple across desktops and mobile devices."
        },
        {
            title: "Reliable backend",
            text: "The backend securely handles authentication, validation, and database operations while ensuring every achievement is stored safely and can be retrieved whenever needed."
        },
        {
            title: "Smart organization",
            text: "Achievements are categorized, searchable, and easy to filter, allowing users to quickly find records instead of searching through spreadsheets or paper files."
        },
        {
            title: "The outcome",
            text: "The portal replaces manual paperwork with a streamlined digital workflow, making achievement management faster, more organized, and easier for both students and faculty."
        }
    ]
},
"ArthaNova": {
    role: "Full-Stack Developer",
    code: "https://github.com/RiteshKumar2e/ArthaNova",
    live: "https://arthanova.vercel.app",
    summary: "Understanding personal finances should not require complicated spreadsheets. ArthaNova transforms financial data into simple dashboards, helping users track spending, monitor trends, and make better financial decisions.",
    steps: [
        {
            title: "The everyday problem",
            text: "Most people know where they earn money but struggle to understand where it actually goes. Traditional financial tools often feel overwhelming and difficult to use."
        },
        {
            title: "Making financial data meaningful",
            text: "I developed an intuitive dashboard that organizes financial information into simple charts, summaries, and visual reports so users can understand their finances at a glance."
        },
        {
            title: "Interactive user experience",
            text: "Using React, I built reusable components and responsive layouts that provide smooth navigation and real-time updates as users interact with the application."
        },
        {
            title: "Connecting with live data",
            text: "The frontend communicates with backend APIs to fetch, update, and display financial information dynamically, ensuring users always see the latest data."
        },
        {
            title: "Designed for every device",
            text: "The interface automatically adapts to desktops, tablets, and mobile devices, providing a consistent experience regardless of screen size."
        },
        {
            title: "Clean and scalable architecture",
            text: "The application is built using modular components, making it easier to maintain, extend, and introduce new financial features in the future."
        },
        {
            title: "The outcome",
            text: "ArthaNova makes personal finance easier to understand through modern dashboards, responsive design, and interactive visualizations that turn complex numbers into meaningful insights."
        }
    ]
}
};

const HoverSkillPill = ({ name, icon: Icon, color, onClick }) => {
    const { isDarkMode } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative flex items-center justify-center w-20 h-14 md:w-24 md:h-16 rounded-2xl border cursor-pointer transition-all duration-200 ${isDarkMode
                ? 'bg-white/5 border-white/5 hover:border-indigo-400/50 hover:bg-indigo-500/10 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-white hover:shadow-lg'
                }`}
            whileHover={{ scale: 1.15, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className={`flex items-center justify-center text-2xl md:text-4xl transition-colors duration-200 ${color}`}>
                <Icon />
            </div>

            {/* Small "click for details" dot hint */}
            <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-indigo-400/60' : 'bg-indigo-500/50'}`} />

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.8 }}
                        animate={{ opacity: 1, y: -10, x: "-50%", scale: 1 }}
                        exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute -top-16 left-1/2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl z-50 border text-center ${isDarkMode
                            ? 'bg-slate-900 border-indigo-500/30 text-white'
                            : 'bg-white border-indigo-100 text-slate-900'
                            }`}
                    >
                        {name}
                        <span className={`block text-[9px] font-medium uppercase tracking-wider mt-0.5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>
                            Click for details
                        </span>
                        {/* Tooltip Arrow */}
                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${isDarkMode
                            ? 'bg-slate-900 border-indigo-500/30'
                            : 'bg-white border-indigo-100'
                            }`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ---- Level 2: deep, step-by-step project case study ----
const ProjectDetailView = ({ name, detail, onBack, onClose, isDarkMode }) => (
    <>
        {/* Top bar: Back + Close */}
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={onBack}
                className={`group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
                <FaArrowLeft className="text-[10px] transition-transform group-hover:-translate-x-1" />
                Back
            </button>
            <button
                onClick={onClose}
                aria-label="Close"
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors ${isDarkMode
                    ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                    }`}
            >
                <FaTimes />
            </button>
        </div>

        {/* Title + role */}
        <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {name}
        </h3>
        <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            {detail.role}
        </div>

        {/* In simple terms (non-technical summary) */}
        <div className={`mt-6 rounded-2xl border p-4 ${isDarkMode ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/60 border-indigo-100'}`}>
            <span className={`block text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                In simple terms
            </span>
            <p className={`text-[15px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {detail.summary}
            </p>
        </div>

        {/* Step-by-step build story */}
        <span className={`block text-[10px] font-black uppercase tracking-[0.25em] mt-7 mb-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
            How I built it — step by step
        </span>
        <ol className="space-y-4">
            {detail.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                    <span className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                        {idx + 1}
                    </span>
                    <div>
                        <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {step.title}
                        </h4>
                        <p className={`text-[13.5px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {step.text}
                        </p>
                    </div>
                </li>
            ))}
        </ol>

        {/* Links */}
        {(detail.live || detail.code) && (
            <div className="flex flex-wrap gap-3 mt-8">
                {detail.live && (
                    <a
                        href={detail.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 h-11 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                    >
                        <FaExternalLinkAlt className="text-[11px]" /> Live
                    </a>
                )}
                {detail.code && (
                    <a
                        href={detail.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-5 h-11 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}
                    >
                        <FaGithubBrand className="text-[13px]" /> Code
                    </a>
                )}
            </div>
        )}
    </>
);

// ---- Level 1: skill overview (description + where it was used) ----
const SkillOverview = ({ skill, onClose, onOpenProject, isDarkMode }) => {
    const Icon = skill.icon;
    return (
        <>
            {/* Close button */}
            <button
                onClick={onClose}
                aria-label="Close"
                className={`absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors ${isDarkMode
                    ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                    }`}
            >
                <FaTimes />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pr-10">
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-4xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={skill.color}><Icon /></span>
                </div>
                <div>
                    <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {skill.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {skill.categoryTitle && (
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                {skill.categoryTitle}
                            </span>
                        )}
                        {skill.level && (
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                                {skill.level}
                            </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Still exploring
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className={`text-[15px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {skill.description}
            </p>

            {/* Where I've used it */}
            {skill.usedIn?.length > 0 && (
                <div className="mt-7">
                    <span className={`block text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        Where I've used it
                    </span>
                    <div className="space-y-2.5">
                        {skill.usedIn.map((item, idx) => {
                            const clickable = Boolean(projectDetails[item.project]);
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={clickable ? () => onOpenProject(item.project) : undefined}
                                    disabled={!clickable}
                                    className={`w-full text-left rounded-2xl border p-4 transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/70'} ${clickable ? (isDarkMode ? 'hover:border-indigo-500/40 hover:bg-indigo-500/10 cursor-pointer' : 'hover:border-indigo-300 hover:bg-white hover:shadow-md cursor-pointer') : 'cursor-default'}`}
                                >
                                    <div className={`flex items-center justify-between gap-2 text-sm font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <span className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            {item.project}
                                        </span>
                                        {clickable && <FaArrowRight className={`text-[11px] ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />}
                                    </div>
                                    <p className={`text-[13px] leading-relaxed pl-3.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {item.detail}
                                    </p>
                                    {clickable && (
                                        <span className={`block pl-3.5 mt-1.5 text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                            Click to read flow →
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

const SkillModal = ({ skill, onClose }) => {
    const { isDarkMode } = useTheme();
    const [openProject, setOpenProject] = useState(null);

    if (!skill) return null;

    const detail = openProject ? projectDetails[openProject] : null;

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className={`absolute inset-0 backdrop-blur-lg ${isDarkMode ? 'bg-black/85' : 'bg-slate-900/60'}`} />

            {/* Panel */}
            <motion.div
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain rounded-3xl border p-6 md:p-8 shadow-2xl ${isDarkMode
                    ? 'bg-slate-900 border-white/10 shadow-black/50'
                    : 'bg-white border-slate-200 shadow-slate-400/30'
                    }`}
            >
                {detail ? (
                    <ProjectDetailView
                        name={openProject}
                        detail={detail}
                        onBack={() => setOpenProject(null)}
                        onClose={onClose}
                        isDarkMode={isDarkMode}
                    />
                ) : (
                    <SkillOverview
                        skill={skill}
                        onClose={onClose}
                        onOpenProject={setOpenProject}
                        isDarkMode={isDarkMode}
                    />
                )}
            </motion.div>
        </motion.div>,
        document.body
    );
};

const SkillCategory = ({ title, icon: Icon, skills, index, onSelectSkill }) => {
    const { isDarkMode } = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-3xl p-6 md:p-8 border transition-all duration-300 hover:-translate-y-1 ${isDarkMode
                ? 'bg-slate-900/60 border-white/10 hover:border-indigo-500/30 shadow-xl shadow-black/20'
                : 'bg-white border-slate-200/70 shadow-soft hover:border-indigo-200 hover:shadow-premium'
                }`}
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-colors duration-300 border ${isDarkMode ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                    <Icon />
                </div>
                <h3 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                    <HoverSkillPill
                        key={idx}
                        name={skill.name}
                        icon={skill.icon}
                        color={skill.color}
                        onClick={() => onSelectSkill({ ...skill, categoryTitle: title })}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const SkillsAdvanced = () => {
    const { isDarkMode } = useTheme();
    const [selectedSkill, setSelectedSkill] = useState(null);

    // Close modal on Escape
    useEffect(() => {
        if (!selectedSkill) return;
        const onKey = (e) => e.key === 'Escape' && setSelectedSkill(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedSkill]);

    const skillCategories = [
        {
            title: "Frontend Development",
            icon: FaLaptopCode,
            skills: [
                {
                    name: "React.js", icon: SiReact, color: "text-[#61DAFB]", level: "Intermediate",
                    description: "Most of my frontend projects are built with React because it makes developing scalable and maintainable applications easier. I regularly work with reusable components, React Hooks, routing, API integration, and responsive layouts to create modern user experiences.",
                  usedIn: [
        {
            project: "SOEIT Achievement Portal",
            detail: "Built responsive role-based dashboards, reusable components, and integrated REST APIs for the student achievement management system."
        },
        {
            project: "QuickFix AI Customer Agent",
            detail: "Developed the AI-powered customer support interface with React, dynamic ticket management, authentication, and real-time API communication."
        },
        {
            project: "Community AI Platform",
            detail: "Created multilingual community dashboards, interactive user interfaces, and AI-powered features using reusable React components."
        },
        {
            project: "This Portfolio",
            detail: "Designed and developed this portfolio with React, Framer Motion animations, reusable components, and a fully responsive layout."
        },
        {
            project: "ArthaNova",
            detail: "Built modern financial dashboards, interactive data visualizations, and responsive interfaces with seamless backend integration."
        }
    ]
                },
                {
                    name: "JavaScript", icon: SiJavascript, color: "text-[#F7DF1E]", level: "Intermediate",
                    description: "The language behind all my frontend work — ES6+, async/await, and the React ecosystem.",
                    usedIn: [
                        { project: "All web projects", detail: "Client-side logic, API integration, and interactivity across every React app I've shipped." },
                        { project: "This Portfolio", detail: "Powers every animation and interaction you see on this page." }
                    ]
                },
                {
                    name: "HTML5", icon: SiHtml5, color: "text-[#E34F26]", level: "Intermediate",
                    description: "Semantic, accessible markup as the structural foundation of every interface I build.",
                    usedIn: [
                        { project: "All web frontends", detail: "Document structure for my React apps and this portfolio." }
                    ]
                },
                {
                    name: "CSS3", icon: SiCss, color: "text-[#1572B6]", level: "Intermediate",
                    description: "Modern responsive styling with flexbox, grid, and animations — usually via Tailwind CSS.",
                    usedIn: [
                        { project: "This Portfolio", detail: "Responsive layouts, dark/light theming, and the glassmorphism effects throughout." }
                    ]
                }
            ]
        },
        {
            title: "Backend Development",
            icon: FaServer,
            skills: [
                {
                    name: "Node.js", icon: SiNodedotjs, color: "text-[#339933]", level: "Intermediate",
                    description: "JavaScript runtime I use for backend services, scripts, and the build tooling behind my frontends (Vite, npm).",
                    usedIn: []
                },
                {
                    name: "FastAPI", icon: SiFastapi, color: "text-[#009688]", level: "Intermediate",
                    description: "My go-to Python framework for fast, async REST APIs with built-in request validation.",
                    usedIn: [
                        { project: "Community AI Platform", detail: "Built the async API backend with SQLAlchemy and JWT security." },
                        { project: "QuickFix AI Customer Agent", detail: "Served the agentic RAG system through FastAPI endpoints." }
                    ]
                },
                {
                    name: "Express.js", icon: SiExpress, color: "text-slate-900 dark:text-white", level: "Intermediate",
                    description: "Minimal Node.js framework for building lightweight REST APIs and web servers.",
                    usedIn: []
                },
                {
                    name: "Python", icon: SiPython, color: "text-[#3776AB]", level: "Intermediate",
                    description: "My primary language for AI/ML, data science, and backend development.",
                    usedIn: [
                        { project: "Steel Surface Defect Detection", detail: "Built the full PyTorch training and inference pipeline." },
                        { project: "Combat Online Plagiarism", detail: "Implemented the NLP similarity engine over vector embeddings." },
                        { project: "Sentiment Analysis Pipeline", detail: "Wrote the end-to-end scoring and visualization pipeline." }
                    ]
                },
                {
                    name: "JWT", icon: SiJsonwebtokens, color: "text-[#D63AFF]", level: "Intermediate",
                    description: "Token-based authentication for securing APIs and managing user sessions.",
                    usedIn: [
                        { project: "Community AI Platform", detail: "Secured the FastAPI backend with JWT-based auth on protected routes." }
                    ]
                },
                {
                    name: "Pydantic", icon: SiPydantic, color: "text-[#E92063]", level: "Intermediate",
                    description: "Python data-validation library that enforces correct, typed data at the edges of an API.",
                    usedIn: [
                        { project: "Community AI Platform", detail: "Validated every incoming request before it ever reached the database." }
                    ]
                },
                {
                    name: "C++", icon: SiCplusplus, color: "text-[#00599C]", level: "Intermediate",
                    description: "My language for data structures, algorithms, and performance-focused problem solving.",
                    usedIn: [
                        { project: "DSA & Problem Solving", detail: "Core language for competitive programming and coursework." }
                    ]
                }
            ]
        },
        {
            title: "Database & Cloud",
            icon: FaCloud,
            skills: [
                {
                    name: "PostgreSQL", icon: SiPostgresql, color: "text-[#336791]", level: "Intermediate",
                    description: "Relational database for structured, query-heavy applications, accessed through SQLAlchemy in my Python backends.",
                    usedIn: []
                },
                {
                    name: "MongoDB", icon: SiMongodb, color: "text-[#47A248]", level: "Intermediate",
                    description: "NoSQL document database for flexible, schema-less data models.",
                    usedIn: []
                },
                {
                    name: "MySQL", icon: SiMysql, color: "text-[#4479A1]", level: "Intermediate",
                    description: "Relational database for transactional web applications.",
                    usedIn: [
                        { project: "QuickFix AI Customer Agent", detail: "Used a MySQL-compatible MariaDB store for complaints and agent state." }
                    ]
                },
                {
                    name: "SQLAlchemy", icon: SiSqlalchemy, color: "text-[#D71F00]", level: "Intermediate",
                    description: "Python ORM for clean, type-safe database access without writing raw SQL.",
                    usedIn: [
                        { project: "Community AI Platform", detail: "Modeled and queried the database through async SQLAlchemy." }
                    ]
                },
                {
                    name: "GCP Cloud", icon: SiGooglecloud, color: "text-[#4285F4]", level: "Intermediate",
                    description: "Google Cloud Platform for hosting, deployment, and managed services.",
                    usedIn: []
                },
                {
                    name: "GitHub Pages", icon: SiGithub, color: "text-slate-900 dark:text-white", level: "Intermediate",
                    description: "Static hosting for deploying frontend projects straight from a repository.",
                    usedIn: []
                }
            ]
        },
        {
            title: "Data Science & AI",
            icon: FaBrain,
            skills: [
                {
                    name: "Deep Learning", icon: FaBrain, color: "text-[#FF6F00]", level: "Intermediate",
                    description: "Designing and training neural networks for computer-vision and prediction tasks.",
                    usedIn: [
                        { project: "Steel Surface Defect Detection", detail: "Built an AMFF-CNN detector with attention-based multi-scale feature fusion (98.33% accuracy)." },
                        { project: "Age Gender Prediction", detail: "Trained a real-time CNN model for live age and gender estimation." }
                    ]
                },
                {
                    name: "TensorFlow", icon: SiTensorflow, color: "text-[#FF6F00]", level: "Intermediate",
                    description: "Framework for building and training deep-learning models and experimenting with architectures.",
                    usedIn: []
                },
                {
                    name: "PyTorch", icon: SiPytorch, color: "text-[#EE4C2C]", level: "Intermediate",
                    description: "My preferred deep-learning framework for research-style model building and training.",
                    usedIn: [
                        { project: "Steel Surface Defect Detection", detail: "Built the MobileNetV2 + Feature Pyramid Network detector in PyTorch." },
                        { project: "Age Gender Prediction", detail: "Implemented and trained the real-time CNN model." }
                    ]
                },
                {
                    name: "CNN", icon: SiKeras, color: "text-[#D00000]", level: "Intermediate",
                    description: "Convolutional neural networks for image classification and detection.",
                    usedIn: [
                        { project: "Steel Surface Defect Detection", detail: "Designed the AMFF-CNN with attention-based multi-scale fusion." },
                        { project: "Age Gender Prediction", detail: "CNN paired with a Haarcascade classifier for face detection." }
                    ]
                },
                {
                    name: "OpenCV", icon: SiOpencv, color: "text-[#5C3EE8]", level: "Intermediate",
                    description: "Computer-vision toolkit for image processing and real-time camera pipelines.",
                    usedIn: [
                        { project: "Steel Surface Defect Detection", detail: "Image preprocessing for the defect-detection pipeline." },
                        { project: "Age Gender Prediction", detail: "Live face detection from the camera feed." }
                    ]
                },
                {
                    name: "Scikit-learn", icon: SiScikitlearn, color: "text-[#F7931E]", level: "Intermediate",
                    description: "Classic ML toolkit for modeling, evaluation, and preprocessing on tabular data.",
                    usedIn: []
                },
                {
                    name: "Pandas", icon: SiPandas, color: "text-[#150458]", level: "Intermediate",
                    description: "Data wrangling and analysis on tabular datasets.",
                    usedIn: [
                        { project: "Black Friday Sales Model", detail: "Feature engineering on historical sales data before modeling." },
                        { project: "Sentiment Analysis Pipeline", detail: "Preparing and structuring text data for scoring." }
                    ]
                },
                {
                    name: "NumPy", icon: SiNumpy, color: "text-[#013243]", level: "Intermediate",
                    description: "Numerical computing and array operations that underpin my ML pipelines.",
                    usedIn: [
                        { project: "All ML projects", detail: "Vectorized math and array handling across every model I build." }
                    ]
                },
                {
                    name: "Machine Learning", icon: FaChartLine, color: "text-[#FF6F00]", level: "Intermediate",
                    description: "Training models that learn patterns from data to make predictions and classifications.",
                    usedIn: [
                        { project: "Black Friday Sales Model", detail: "Forecasted customer spending from historical sales data." },
                        { project: "Sentiment Analysis Pipeline", detail: "Scored the mood of text at scale." },
                        { project: "Combat Online Plagiarism", detail: "Detected reworded copying using meaning-based similarity." }
                    ]
                },
                {
                    name: "Generative AI (LLMs)", icon: SiGooglegemini, color: "text-[#8E75B2]", level: "Intermediate",
                    description: "Building with large language models — Gemini and LLaMA — for chat, reasoning, and AI agents.",
                    usedIn: [
                        { project: "QuickFix AI Customer Agent", detail: "Powered 30+ support agents with Gemini 2.0 and Groq LLaMA." },
                        { project: "Community AI Platform", detail: "Drove the context-aware multilingual chat assistant." }
                    ]
                },
                {
                    name: "RAG", icon: FaNetworkWired, color: "text-[#10A37F]", level: "Intermediate",
                    description: "Retrieval-Augmented Generation — grounding an LLM's answers in real source documents so it doesn't guess.",
                    usedIn: [
                        { project: "QuickFix AI Customer Agent", detail: "Made every agent policy-aware by retrieving real policy docs before answering." }
                    ]
                },
                {
                    name: "NLP", icon: FaLanguage, color: "text-[#4B8BBE]", level: "Intermediate",
                    description: "Natural Language Processing — teaching machines to understand, compare, and score human text.",
                    usedIn: [
                        { project: "Combat Online Plagiarism", detail: "Compared documents by meaning using vector embeddings." },
                        { project: "Sentiment Analysis Pipeline", detail: "Processed and scored large volumes of text." }
                    ]
                },
                {
                    name: "Transformers", icon: SiHuggingface, color: "text-[#FFD21E]", level: "Intermediate",
                    description: "Modern neural architectures (via Hugging Face) that turn text into meaning-rich embeddings.",
                    usedIn: [
                        { project: "Combat Online Plagiarism", detail: "Generated embeddings to catch paraphrased plagiarism." }
                    ]
                },
                {
                    name: "Computer Vision", icon: FaEye, color: "text-[#5C3EE8]", level: "Intermediate",
                    description: "Enabling software to interpret images and live video — detection, recognition, and classification.",
                    usedIn: [
                        { project: "Steel Surface Defect Detection", detail: "Spotted fine surface defects from production-line images." },
                        { project: "Age Gender Prediction", detail: "Detected faces and predicted age/gender from a live camera feed." }
                    ]
                },
                {
                    name: "XGBoost", icon: FaTree, color: "text-[#337AB7]", level: "Intermediate",
                    description: "Gradient-boosted decision trees — a top performer for structured, tabular prediction.",
                    usedIn: [
                        { project: "Black Friday Sales Model", detail: "Forecast customer spending with high accuracy on tabular data." }
                    ]
                },
                {
                    name: "LightGBM", icon: FaSitemap, color: "text-[#02C39A]", level: "Intermediate",
                    description: "A fast, efficient gradient-boosting framework for large tabular datasets.",
                    usedIn: [
                        { project: "Black Friday Sales Model", detail: "Paired with XGBoost to model spending patterns efficiently." }
                    ]
                },
                {
                    name: "Plotly", icon: SiPlotly, color: "text-[#3F4F75]", level: "Intermediate",
                    description: "Interactive data-visualization library for turning results into readable, explorable charts.",
                    usedIn: [
                        { project: "Sentiment Analysis Pipeline", detail: "Built dynamic charts so anyone could read the sentiment at a glance." }
                    ]
                },
                {
                    name: "Data Analysis", icon: FaChartBar, color: "text-[#150458]", level: "Intermediate",
                    description: "Cleaning, exploring, and drawing insight from raw datasets before any modeling begins.",
                    usedIn: [
                        { project: "Black Friday Sales Model", detail: "Explored and engineered features from historical sales data." },
                        { project: "Sentiment Analysis Pipeline", detail: "Structured and summarised large text datasets." }
                    ]
                }
            ]
        },
        {
            title: "Developer Tools",
            icon: FaTools,
            skills: [
                {
                    name: "Git", icon: SiGit, color: "text-[#F05032]", level: "Intermediate",
                    description: "Version control for tracking, branching, and collaborating on every project.",
                    usedIn: [
                        { project: "Every project", detail: "All my work is version-controlled and pushed to GitHub." }
                    ]
                },
                {
                    name: "GitHub", icon: SiGithub, color: "text-slate-900 dark:text-white", level: "Intermediate",
                    description: "Where I host, version, and showcase all my repositories.",
                    usedIn: [
                        { project: "Every project", detail: "Each project in the work section is open-source on my GitHub." }
                    ]
                },
                {
                    name: "VS Code", icon: VscVscode, color: "text-[#007ACC]", level: "Intermediate",
                    description: "My primary editor for both web and ML development.",
                    usedIn: []
                },
                {
                    name: "Jupyter", icon: SiJupyter, color: "text-[#F37626]", level: "Intermediate",
                    description: "Notebook environment for ML experimentation and data exploration.",
                    usedIn: [
                        { project: "ML & data projects", detail: "Prototyping models and exploring data before productionizing." }
                    ]
                }
            ]
        }
    ];

    const coursework = [
        { name: "Data Structures", icon: FaCodeBranch, level: "Coursework", description: "Arrays, trees, graphs, hashing, and the algorithms that run on them — the backbone of my problem solving." },
        { name: "OOPs", icon: FaCube, level: "Coursework", description: "Object-oriented design principles I apply when structuring real applications." },
        { name: "DBMS", icon: FaDatabase, level: "Coursework", description: "Relational design, normalization, and SQL that underpin my database work." },
        { name: "Software Eng.", icon: FaShapes, level: "Coursework", description: "SDLC, design patterns, and version-control practices for building maintainable software." }
    ];

    const interests = [
        { name: "Machine Learning", icon: FaBrain, level: "Interest", description: "Building models that learn from data — the area most of my projects live in." },
        { name: "Deep Learning", icon: FaLayerGroup, level: "Interest", description: "Neural networks for vision and language; my main research focus." },
        { name: "Web Development", icon: FaGlobe, level: "Interest", description: "Crafting fast, polished full-stack web experiences." }
    ];

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            {/* Background Matrix */}
            <div className={`absolute inset-0 pointer-events-none -z-10 ${isDarkMode ? 'opacity-30' : 'opacity-5'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] mb-6 border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                    >
                        Tech Stack
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`text-5xl md:text-7xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                        Skills & <span className="gradient-text">Tools</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        Click any skill to see exactly where and how I've used it.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {skillCategories.map((category, index) => (
                        <SkillCategory
                            key={index}
                            title={category.title}
                            icon={category.icon}
                            skills={category.skills}
                            index={index}
                            onSelectSkill={setSelectedSkill}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 flex flex-col items-center gap-8"
                >
                    {/* Coursework */}
                    <div className={`w-full max-w-4xl p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-lg'}`}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <span className={`text-sm font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-indigo-400' : 'text-slate-500'}`}>
                                Core Coursework:
                            </span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {coursework.map((course, idx) => (
                                    <HoverSkillPill
                                        key={idx}
                                        name={course.name}
                                        icon={course.icon}
                                        color={isDarkMode ? 'text-white' : 'text-slate-900'}
                                        onClick={() => setSelectedSkill({ ...course, color: isDarkMode ? 'text-white' : 'text-slate-900', categoryTitle: 'Core Coursework' })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interests */}
                    <div className={`w-full max-w-4xl p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-100 shadow-lg'}`}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <span className={`text-sm font-black uppercase tracking-widest whitespace-nowrap ${isDarkMode ? 'text-indigo-400' : 'text-slate-500'}`}>
                                Key Interests:
                            </span>
                            <div className="flex flex-wrap justify-center gap-3">
                                {interests.map((interest, idx) => (
                                    <HoverSkillPill
                                        key={idx}
                                        name={interest.name}
                                        icon={interest.icon}
                                        color={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}
                                        onClick={() => setSelectedSkill({ ...interest, color: isDarkMode ? 'text-indigo-400' : 'text-indigo-600', categoryTitle: 'Key Interest' })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Skill detail modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default SkillsAdvanced;
