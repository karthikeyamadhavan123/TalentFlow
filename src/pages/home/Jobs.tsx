import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, DollarSign } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { containerVariantsJob, itemVariantsJob } from '@/utils/variants';
import { jobs } from '@/utils/data';


const Jobs = () => {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Featured <span className={`${isDark ? 'bg-linear-to-r from-cyan-400 to-blue-500' : 'bg-linear-to-r from-purple-600 to-pink-600'} bg-clip-text text-transparent`}>Jobs</span>
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover exciting career opportunities from top companies
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <motion.div
          variants={containerVariantsJob}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {jobs.map((job: any) => (
            <motion.div
              key={job.id}
              variants={itemVariantsJob}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl border transition-all duration-300 ${isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
                  : 'bg-white border-gray-200 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10'
                }`}
            >
              {/* Job Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{job.logo}</div>
                  <div>
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.company}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {job.location}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{job.salary}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag:any, index:number) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${isDark
                        ? 'bg-cyan-900 text-cyan-300'
                        : 'bg-purple-100 text-purple-700'
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {job.posted}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDark
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-lg font-semibold text-lg border-2 transition-all ${isDark
                ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
                : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
              }`}
          >
            View All Jobs
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Jobs;