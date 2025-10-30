import { useTheme } from '@/context/ThemeContext';
import { loadingStates } from '@/utils/data';
import { useEffect, useState } from 'react';
import Particle from '../Particle';

const LoadingAnimation = () => {
    const { isDark } = useTheme();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % loadingStates.length);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Particle isDark={isDark}/>
            <style>{`
                @keyframes slideUp {
                    0% { 
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                }

                .slide-up {
                    animation: slideUp 1s ease-in-out infinite;
                    padding: 8px 16px;
                    font-weight: 500;
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                }
            `}</style>

            <div className="flex items-center flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg w-full max-w-xs sm:max-w-md md:max-w-lg">
                <p className={`slide-up text-base sm:text-lg md:text-xl lg:text-2xl text-center px-2 ${
                    isDark 
                        ? "bg-linear-to-r from-cyan-400 to-blue-500" 
                        : "bg-linear-to-r from-purple-600 to-pink-600"
                }`}>
                    {loadingStates[index]}
                </p>
            </div>
        </>
    );
}

export default LoadingAnimation;