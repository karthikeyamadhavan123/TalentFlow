import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import ParagraphAnimation from '@/components/Animations/ParagraphAnimation';
import Animation from '@/components/Animations/Animation';
import Particle from '@/components/Particle';
import { Briefcase, Rocket } from 'lucide-react';


const Hero = () => {
  const { isDark } = useTheme();
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Particle isDark={isDark} />
      <div className="text-center max-w-4xl mx-auto">
        <Animation
          text="Find Your Dream Job."
          color={`text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
          highlightWord="Dream Job"
          highlightClass={`text-4xl sm:text-6xl lg:text-7xl font-bold ${isDark ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'} bg-clip-text text-transparent`}
        />

        <div className="mb-8">
          <ParagraphAnimation text='Build Your Dream Team,' color={`${isDark ? 'text-white' : 'text-gray-900'}`} words={["Effortlessly.",
            "Together.",
            "Strategically.",
            "Successfully.",
            "Now."]} isDark={isDark} />
        </div>

      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center gap-2 px-8 py-3 text-white rounded-lg font-semibold text-lg shadow-md cursor-pointer w-full sm:w-auto text-center ${isDark
        ? "bg-linear-to-r from-cyan-400 to-blue-500"
        : "bg-linear-to-r from-purple-600 to-pink-600"
      }`}
  >
    <Rocket size={20} />
    Get Started
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center gap-2 px-8 py-3 border-2 rounded-lg font-semibold text-lg transition-colors cursor-pointer w-full sm:w-auto text-center ${isDark
        ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
        : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
      }`}
  >
    <Briefcase size={20} />
    Browse Jobs
  </motion.button>
</motion.div>
      </div>
    </section>
  );
};

export default Hero;