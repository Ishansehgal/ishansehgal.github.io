import { useRef, useEffect } from "react";

const experiences = [
    {
        company: "Regbetel Labs",
        role: "Robotics Developer",
        period: "Present",
        description: "Spearheading the development of autonomous navigation stacks using ROS2. Implementing custom Nav2 plugins and optimizing localization pipelines with Beluga and AMCL for reliable performance in dynamic environments.",
        tech: ["ROS2", "Nav2", "Beluga", "C++", "Python"]
    },
    {
        company: "Personal Projects (TARS)",
        role: "Lead Developer",
        period: "2023 - Present",
        description: "Designing and building a functional replica of the TARS robot from Interstellar. Focusing on complex kinematics, gait generation, and human-robot interaction.",
        tech: ["Robotics", "Kinematics", "Embedded Systems"]
    },
    {
        company: "Early Journey",
        role: "Robotics Enthusiast",
        period: "2020 - 2022",
        description: "Started with Arduino based robots (line followers, obstacle avoiders) which sparked the passion for autonomous systems. Quickly graduated to complex multi-agent systems and ROS.",
        tech: ["Arduino", "Electronics", "C"]
    }
];

export const Experience = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = containerRef.current?.querySelectorAll(".reveal");
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section id="experience" className="py-20 md:py-32 relative">
            <div ref={containerRef} className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <span className="text-sm font-bold tracking-widest uppercase mb-8 block reveal text-primary">Journey</span>

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <div key={index} className="reveal relative border-l-2 border-border pl-8 ml-2">
                                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <h3 className="text-2xl font-bold">{exp.company}</h3>
                                    <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{exp.period}</span>
                                </div>
                                <div className="text-lg font-medium text-primary/80 mb-3">{exp.role}</div>
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                    {exp.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tech.map((t, i) => (
                                        <span key={i} className="text-xs font-mono text-primary/60 border border-border px-2 py-1 rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
