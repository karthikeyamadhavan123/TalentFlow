import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';

const ParagraphAnimation = ({ text, color, words, isDark }: { text: string, color: string, words: string[], isDark: boolean }) => {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [index]); 

    return (
        <p className={`${color} text-xl md:text-2xl leading-relaxed`}>
            {text}{' '}
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5 }}
                    className={`inline-block font-semibold ${isDark ? 'bg-linear-to-r from-cyan-400 to-blue-500' : 'bg-linear-to-r from-purple-600 to-pink-600'} bg-clip-text text-transparent`}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </p>
    )
}

export default ParagraphAnimation