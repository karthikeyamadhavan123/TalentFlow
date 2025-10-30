import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Eye, EyeOff, Mail, Lock, Rocket } from 'lucide-react';
import AuthParticle from '@/components/Particle';
import { fakeHRUsers } from '@/auth/authData';
import LoadingAnimation from '@/components/Animations/LoadingAnimation';

const Login = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
       setError('');
      const user = fakeHRUsers.find(
        user => user.email === formData.email && user.password === formData.password
      );
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));

        //simulating an api requsest delay using promise 
        setTimeout(() => {
          navigate('/jobs');
          setLoading(false);
        }, 5000)
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
    } 
  };

  return (
    <>
      {
        loading ? (
          <LoadingAnimation />
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
            <AuthParticle isDark={isDark} />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl ${isDark
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
                  className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center  bg-linear-to-r ${isDark
                    ? "from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                    : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    } transition-all shadow-lg text-sm sm:text-base`}
                >
                  <Rocket className="text-white" size={20} />
                </motion.div>
                <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Back
                </h1>
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Sign in to your TalentFlow account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${isDark
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
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-colors text-sm sm:text-base ${isDark
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

                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className={`w-4 h-4 rounded border-2 ${isDark
                        ? 'bg-gray-700 border-gray-600 text-cyan-400 focus:ring-cyan-400'
                        : 'bg-white border-gray-300 text-purple-500 focus:ring-purple-500'
                        } focus:ring-2 focus:ring-offset-2`}
                    />
                    <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className={`text-sm font-medium transition-colors text-center sm:text-right ${isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-purple-600 hover:text-purple-500'
                      }`}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white bg-linear-to-r ${isDark
                    ? "from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                    : "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    } transition-all shadow-lg text-sm sm:text-base`}
                >
                  Sign In
                </motion.button>
              </form>

              {/* Signup Link */}
              <div className="text-center mt-4 sm:mt-6">
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className={`font-semibold transition-colors ${isDark
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-purple-600 hover:text-purple-500'
                      }`}
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {error && (
                <div className={`mt-4 p-3 rounded ${isDark ? ' text-red-400' : ' text-cyan-400'}`}>
                  {error}
                </div>
              )}

              {/* Demo Accounts */}
              <div className={`mt-6 sm:mt-8 p-3 sm:p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                <p className={`text-xs sm:text-sm text-center mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Demo Accounts
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                    <div className="font-medium">Candidate</div>
                    <div>email: candidate@demo.com</div>
                    <div>pass: demo123</div>
                  </div>
                  <div className={`p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-white'}`}>
                    <div className="font-medium">Recruiter</div>
                    <div>email: recruiter@demo.com</div>
                    <div>pass: demo123</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )
      }
    </>
  );
};

export default Login;