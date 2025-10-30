import { useState } from 'react';
import { Sun, Moon, UserPlus, LogIn, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { containerVariants, itemVariants, mobileMenuVariants, mobileItemVariants } from '@/utils/variants';
import { motion, useScroll, useSpring } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';
import { menuItems } from '@/utils/data';
import type { menuItemProps } from '@/types';

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const MotionLink = motion.create(Link);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <>

            <motion.div
                className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
                style={{
                    scaleX,
                    background: "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #6366f1, #a855f7)",
                }}
            />
            
            <nav className={`fixed top-0 left-0 right-0 z-40 ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                            className="flex items-center group cursor-pointer"
                        >
                            <Link to="/" className="relative">
                                <h1 className={`text-2xl font-bold bg-linear-to-r ${isDark ? 'from-cyan-400 to-blue-500' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105`}>
                                    TalentFlow
                                </h1>
                                <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r ${isDark ? 'from-cyan-400 to-blue-500' : 'from-purple-600 to-pink-600'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="hidden md:flex items-center space-x-1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {menuItems.map((item) => (
                                <motion.div key={item.to} variants={itemVariants}>
                                    <Link
                                        to={item.to}
                                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isDark ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>


                        <div className="flex items-center space-x-3">

                            <motion.button
                                onClick={toggleTheme}
                                whileTap={{ scale: 0.8, rotate: isDark ? 0 : 360 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                className={`p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </motion.button>

                            <motion.div
                                className="hidden md:flex items-center space-x-3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={itemVariants}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95, y: 2 }}
                                        className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${isDark ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50' : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'}`} onClick={()=>navigate('/signup')}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Sign Up
                                    </motion.button>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95, y: 2 }}
                                        className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border-2 cursor-pointer ${isDark ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'}`} onClick={()=>navigate('/login')}
                                    >
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </motion.button>
                                </motion.div>
                            </motion.div>

                            <motion.button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                whileTap={{ scale: 0.9 }}
                                className={`md:hidden p-2 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={false}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    variants={mobileMenuVariants}
                    className="md:hidden overflow-hidden"
                >
                    <motion.div
                        className={`px-4 py-4 space-y-3 ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
                        variants={containerVariants}
                    >
                        {menuItems.map((item:menuItemProps) => (
                            <motion.div key={item.to} variants={mobileItemVariants}>
                                <MotionLink
                                    to={item.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isDark ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    {item.label}
                                </MotionLink>
                            </motion.div>
                        ))}

                        <motion.div variants={mobileItemVariants}>
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${isDark ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white' : 'bg-linear-to-r from-purple-600 to-pink-600 text-white'}`} onClick={()=>navigate('/signup')}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Sign Up
                            </motion.button>
                        </motion.div>
                        
                        <motion.div variants={mobileItemVariants}>
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border-2 ${isDark ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'}`} onClick={()=>navigate('/login')}
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </nav>
        </>
    );
};

export default Navbar;