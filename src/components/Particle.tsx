import { loadSlim } from "tsparticles-slim";
import { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";

const Particle = ({ isDark }: { isDark: boolean }) => {
    const particleOptions = useMemo(() => {
        return {
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 60,
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        area: 800,
                    },
                },
                color: {
                    value: isDark ? "#60a5fa" : "#9333ea",
                },
                shape: {
                    type: "circle",
                },
                opacity: {
                    value: 0.5,
                },
                size: {
                    value: { min: 1, max: 3 },
                },
                links: {
                    enable: true,
                    distance: 150,
                    color: isDark ? "#60a5fa" : "#9333ea",
                    opacity: 0.4,
                    width: 1,
                },
                move: {
                    enable: true,
                    speed: isDark ? 0.3 : 0.6,
                    direction: "right" as const,
                    random: false,
                    straight: false,
                    outModes: {
                        default: "bounce" as const,
                    },
                },
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                },
            },
            detectRetina: true,
        };
    }, [isDark])

    const particleInit = useCallback(async (engine: any) => {
        await loadSlim(engine);
    }, [])

    return (
        <Particles
            init={particleInit}
            options={particleOptions}
            className="absolute inset-0 pointer-events-none -z-10"
        />
    )
}

export default Particle;