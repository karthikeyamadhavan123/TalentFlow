import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from './Hero';
import MarketInsights from '@/components/MarketInsights'; 
import Jobs from './Jobs';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';
import { backgroundVariants, containerVariantsHome, pageVariants, sectionVariants } from '@/utils/variants';

const Home = () => {
    const { isDark } = useTheme();
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className={`min-h-screen transition-colors duration-500 ${isDark
                    ? 'bg-gray-900 text-white'
                    : 'bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'
                }`}
        >
            {/* Animated background gradient for light mode */}
            {!isDark && (
                <motion.div
                    variants={backgroundVariants}
                    initial="initial"
                    animate="animate"
                    className="fixed inset-0 bg-linear-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 bg-size-[200%_200%] pointer-events-none z-0"
                />
            )}

            {/* Content */}
            <div className="relative z-10">
                <Navbar />

                <motion.main
                    variants={containerVariantsHome}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Section with enhanced animation */}
                    <motion.section
                        variants={sectionVariants}
                        className="relative overflow-x-hidden"
                    >
                        <Hero />
                    </motion.section>

                    {/* Market Insights Section - NEW ADDITION */}
                    <motion.section
                        variants={sectionVariants}
                        whileInView="visible"
                        initial="hidden"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <MarketInsights />
                    </motion.section>

                    {/* Jobs Section with scroll-triggered reveal */}
                    <motion.section
                        variants={sectionVariants}
                        whileInView="visible"
                        initial="hidden"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Jobs />
                    </motion.section>
                </motion.main>

                {/* Footer with fade-in animation */}
                <motion.footer
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Footer />
                </motion.footer>
            </div>

            {/* Floating background elements for visual interest */}
            {!isDark && (
                <>
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="fixed top-1/4 left-10 w-4 h-4 bg-purple-300 rounded-full opacity-20 blur-sm pointer-events-none z-0"
                    />
                    <motion.div
                        animate={{
                            y: [0, 30, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="fixed top-3/4 right-20 w-6 h-6 bg-pink-300 rounded-full opacity-20 blur-sm pointer-events-none z-0"
                    />
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="fixed bottom-1/3 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-15 blur-sm pointer-events-none z-0"
                    />
                </>
            )}

            {/* Dark mode floating elements */}
            {isDark && (
                <>
                    <motion.div
                        animate={{
                            y: [0, -25, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="fixed top-1/3 right-16 w-5 h-5 bg-cyan-500 rounded-full blur-sm pointer-events-none z-0"
                    />
                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            opacity: [0.05, 0.2, 0.05],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 3
                        }}
                        className="fixed bottom-1/4 left-20 w-4 h-4 bg-blue-500 rounded-full blur-sm pointer-events-none z-0"
                    />
                </>
            )}
        </motion.div>
    );
};

export default Home;