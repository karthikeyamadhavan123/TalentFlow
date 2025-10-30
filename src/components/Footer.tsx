  import { motion } from 'framer-motion';
  import { Link } from 'react-router-dom';
  import { 
    Mail, 
    Phone, 
    MapPin,
    ArrowRight
  } from 'lucide-react';
  import { useTheme } from '@/context/ThemeContext';
  import { containerVariantsFooter, itemVariantsFooter } from '@/utils/variants';
  import { footerLinks, socialLinks } from '@/utils/data';

  const Footer = () => {
    const { isDark } = useTheme();
    return (
      <footer className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300  relative z-20 `}>
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={containerVariantsFooter}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8"
          >
            {/* Brand Column */}
            <motion.div variants={itemVariantsFooter} className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <h2 className={`text-2xl font-bold bg-linear-to-r ${isDark ? 'from-cyan-400 to-blue-500' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
                  TalentFlow
                </h2>
              </div>
              <p className={`mb-6 max-w-md ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Connecting top talent with amazing opportunities. Find your dream job or discover exceptional candidates with our platform.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>contact@talentflow.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>San Francisco, CA</span>
                </div>
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariantsFooter}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className={`flex items-center space-x-2 transition-all duration-300 group ${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Candidates Links */}
            <motion.div variants={itemVariantsFooter}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Candidates</h3>
              <ul className="space-y-3">
                {footerLinks.candidates.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className={`flex items-center space-x-2 transition-all duration-300 group ${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Employers Links */}
            <motion.div variants={itemVariantsFooter}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Employers</h3>
              <ul className="space-y-3">
                {footerLinks.employers.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className={`flex items-center space-x-2 transition-all duration-300 group ${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div variants={itemVariantsFooter}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className={`flex items-center space-x-2 transition-all duration-300 group ${
                        isDark 
                          ? 'text-gray-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Stay Updated
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Get the latest job opportunities and career tips
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                  }`}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <div className={`border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 TalentFlow. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-800 text-gray-400 hover:bg-cyan-600 hover:text-white'
                        : 'bg-white text-gray-600 hover:bg-purple-600 hover:text-white shadow-sm'
                    }`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;