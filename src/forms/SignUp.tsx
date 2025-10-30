import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff, Mail, Lock, User, Rocket } from 'lucide-react';
import AuthParticle from '@/components/Particle';

const Signup = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup data:', formData);
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      <AuthParticle isDark={isDark} />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl ${
          isDark 
            ? 'bg-gray-800/80 backdrop-blur-md border border-gray-700' 
            : 'bg-white/80 backdrop-blur-md border border-white/20'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center bg-linear-to-r ${
              isDark 
                ? "from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            } transition-all shadow-lg text-sm sm:text-base`}
          >
            <Rocket className="text-white" size={20} />
          </motion.div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Join TalentFlow
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Start your journey to amazing opportunities
          </p>
        </div>


        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Full Name */}
          <div className="relative">
            <User className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:outline-none`}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:outline-none`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:outline-none`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:outline-none`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-linear-to-r ${
              isDark 
                ? "from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            } transition-all shadow-lg text-sm sm:text-base`}
          >
            Create Account
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 sm:mt-6">
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-semibold transition-colors ${
                isDark
                  ? 'text-cyan-400 hover:text-cyan-300'
                  : 'text-purple-600 hover:text-purple-500'
              }`}
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;