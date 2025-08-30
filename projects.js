const ProjectData = {
    "Arduino Car": {
        title: "Arduino Obstacle Avoidance Car",
        period: "2021 - First Year BTech",
        description: "My first step into autonomous robotics - building an obstacle avoidance car using Arduino and ultrasonic sensors.",
        technologies: ["Arduino Uno", "Ultrasonic Sensor", "DC Motors", "Custom Battery Pack", "AQI Sensor"],
        challenges: [
            "Understanding sensor interfacing and signal processing",
            "Implementing basic obstacle detection algorithms",
            "Power management and battery optimization",
            "Mechanical design constraints"
        ],
        learnings: [
            "Embedded programming fundamentals",
            "Sensor fusion basics",
            "Motor control and PWM",
            "Realized limitations of Arduino for complex autonomous systems"
        ],
        technical_details: {
            "Obstacle Detection": "Used HC-SR04 ultrasonic sensor with 200cm range for forward obstacle detection",
            "Motion Control": "Differential drive system with L298N motor driver for precise turning",
            "Power System": "Custom 12V battery pack with voltage regulation for stable operation",
            "Additional Sensors": "MQ-135 for air quality monitoring, demonstrating multi-sensor integration"
        },
        outcomes: "Successfully demonstrated basic autonomous navigation, leading to interest in more sophisticated robotics platforms like ROS."
    },
    
    "ROS Learning": {
        title: "ROS Navigation Stack Mastery",
        period: "2022 - Second Year BTech",
        description: "Deep dive into ROS ecosystem through Rigbetech Labs mentorship program, learning URDF modeling, Gazebo simulation, and navigation stack implementation.",
        technologies: ["ROS Noetic", "URDF", "Gazebo", "RViz", "Navigation Stack", "TurtleSim", "Python", "C++"],
        challenges: [
            "Understanding ROS communication paradigms (topics, services, actions)",
            "URDF modeling and joint relationships",
            "Gazebo physics simulation tuning",
            "Navigation stack parameter optimization"
        ],
        learnings: [
            "ROS architecture and ecosystem",
            "3D robot modeling with URDF",
            "Sensor simulation and integration",
            "Path planning algorithms (A*, RRT)",
            "Localization techniques (AMCL)",
            "Transform tree (tf) concepts"
        ],
        technical_details: {
            "URDF Model": "Created differential drive robot model with accurate inertial properties and sensor mounts",
            "Navigation Stack": "Implemented move_base with custom costmap parameters for dynamic obstacle avoidance",
            "Localization": "Configured AMCL with particle filter for robust pose estimation",
            "Path Planning": "Integrated global planner (NavfnROS) with local planner (DWA) for smooth navigation",
            "Sensor Integration": "Simulated LiDAR with 360° scanning and IMU for odometry enhancement"
        },
        outcomes: "Built strong foundation in ROS development, prepared for complex robotics competitions and real-world applications.",
        code_snippets: {
            "Launch File": `<launch>
    <param name="robot_description" textfile="$(find my_robot)/urdf/robot.urdf" />
    <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher" />
    <include file="$(find my_robot)/launch/move_base.launch" />
</launch>`,
            "Navigation Config": `base_local_planner: "dwa_local_planner/DWAPlannerROS"
controller_frequency: 20.0
planner_patience: 5.0
controller_patience: 15.0`
        }
    },
    
    "eYantra Competition": {
        title: "eYantra Robotics Competition - AIR 13",
        period: "September - December 2023",
        description: "Automated AMR and UR5 robotic arm system for warehouse automation. Achieved All India Rank 13 through simulation and real robot implementation at IIT Bombay.",
        technologies: ["ROS Humble", "Gazebo", "MoveIt", "UR5 Robotic Arm", "AMR", "Python", "OpenCV", "Remote Robot Access"],
        challenges: [
            "Coordinating AMR navigation with robotic arm manipulation",
            "Real-time path planning in dynamic environments",
            "Precision placement of objects using UR5 arm",
            "Adapting simulation code to real robot constraints",
            "Remote debugging and optimization"
        ],
        learnings: [
            "Multi-robot system coordination",
            "MoveIt motion planning framework",
            "Real-world robotics challenges vs simulation",
            "Remote robot operation protocols",
            "Competition strategy and time management"
        ],
        technical_details: {
            "AMR Navigation": "Implemented autonomous navigation for warehouse floor plan with dynamic obstacle avoidance",
            "Manipulation Planning": "Used MoveIt for UR5 arm trajectory planning with collision avoidance",
            "System Integration": "Coordinated AMR positioning with arm reach envelope for optimal manipulation",
            "Real Robot Deployment": "Adapted simulation parameters for real hardware constraints and delays",
            "Performance Optimization": "Achieved 95% task completion rate in final evaluation"
        },
        achievements: [
            "All India Rank 13 out of thousands of participants",
            "Successfully completed both simulation and real robot stages",
            "Demonstrated robust multi-robot coordination",
            "Gained invaluable real-world robotics experience"
        ],
        outcomes: "This competition highlighted the gap between simulation and reality, inspiring me to build my own physical robot for better understanding of real-world constraints."
    },
    
    "DIY AMR": {
        title: "Custom Differential Drive AMR",
        period: "January - March 2024",
        description: "Built from scratch using Articulated Robotics guide - 4-wheel differential drive robot with 2D LiDAR, wheel encoders, and ROS2 navigation stack.",
        technologies: ["ROS2 Foxy", "2D LiDAR", "Wheel Encoders", "Laptop Brain", "Custom Mechanical Design", "Navigation2", "SLAM"],
        challenges: [
            "Mechanical design and fabrication constraints",
            "Motor calibration and encoder integration",
            "LiDAR mounting and data processing",
            "ROS2 navigation stack tuning",
            "Real-world localization accuracy"
        ],
        learnings: [
            "End-to-end robot development process",
            "Hardware-software integration challenges",
            "ROS2 navigation stack (Nav2) implementation",
            "SLAM algorithm practical application",
            "Importance of mechanical precision in robotics"
        ],
        technical_details: {
            "Mechanical Design": "4-wheel differential drive with aluminum frame for rigidity and weight distribution",
            "Sensor Suite": "RPLiDAR A1 for 360° scanning, wheel encoders for odometry, IMU for orientation",
            "Computing Platform": "Repurposed laptop motherboard running Ubuntu 20.04 with ROS2 Foxy",
            "Navigation Stack": "Nav2 with AMCL localization, Smac planner, and regulated pure pursuit controller",
            "SLAM Implementation": "Gmapping for department floor plan creation with 5cm resolution"
        },
        debugging_process: [
            "Months of odometry calibration and drift correction",
            "Sensor fusion parameter tuning for stable localization",
            "Navigation stack parameter optimization for smooth motion",
            "Real-world testing and iterative improvements"
        ],
        outcomes: "Successfully achieved autonomous navigation and mapping in department building, demonstrating practical ROS2 skills and real-world problem-solving abilities."
    },
    
    "IIT Bombay Internship": {
        title: "eYantra Internship - IIT Bombay",
        period: "March - July 2024",
        description: "Automated robot operations for future competition teams through autonomous docking system using ArUco markers and behavior tree implementation.",
        technologies: ["ROS2 Humble", "ArUco Markers", "Computer Vision", "Behavior Trees", "PyTrees", "Navigation2", "OpenCV"],
        challenges: [
            "Precision docking with visual markers",
            "Robust marker detection in varying lighting",
            "Behavior tree design for complex task sequences",
            "Integration with existing robot systems",
            "Minimizing operator intervention"
        ],
        learnings: [
            "Advanced computer vision techniques",
            "Behavior tree architecture and implementation",
            "Visual servoing for precision control",
            "System automation and user interface design",
            "Research environment collaboration"
        ],
        technical_details: {
            "Autonomous Docking": "Implemented visual servoing using ArUco marker detection for sub-centimeter precision",
            "Behavior Trees": "Designed hierarchical task execution with PyTrees for robust state management",
            "Vision System": "OpenCV-based marker detection with kalman filtering for stable pose estimation",
            "Navigation Integration": "Seamless transition between global navigation and precision docking modes",
            "Launch System": "Automated startup sequences reducing operator setup time by 90%"
        },
        research_contributions: [
            "Reduced operator intervention from hours to minutes",
            "Achieved 98% success rate in autonomous docking",
            "Created reusable behavior tree templates for future projects",
            "Documented best practices for competition robot preparation"
        ],
        outcomes: "Gained deep understanding of behavior trees and advanced navigation techniques, setting foundation for professional robotics development."
    },
    
    "Rigbetech Labs": {
        title: "Associate Robotics Developer - Rigbetech Labs",
        period: "October 2024 - Present",
        description: "Professional robotics development on diverse platforms from TurtleBots to industrial AGVs and AMRs, specializing in ROS2 Nav2 and behavior trees.",
        technologies: ["ROS2 Humble", "Nav2", "Behavior Trees", "Industrial AGVs", "AMRs", "Robotic Arms", "Fleet Management"],
        responsibilities: [
            "Custom Nav2 plugin development",
            "Behavior tree implementation for complex workflows",
            "Multi-robot coordination systems",
            "Industrial automation solutions",
            "Real-world deployment and maintenance"
        ],
        projects: [
            "Fleet management system for warehouse automation",
            "Custom recovery behaviors for industrial environments",
            "Advanced path planning for constrained spaces",
            "Integration with robotic manipulation systems"
        ],
        technical_expertise: {
            "Nav2 Development": "Custom plugins for specialized navigation behaviors and recovery actions",
            "Behavior Trees": "Complex decision-making systems for autonomous operations",
            "Fleet Coordination": "Multi-robot task allocation and collision avoidance",
            "Industrial Integration": "Integration with existing automation systems and protocols",
            "Performance Optimization": "Real-time optimization for production environments"
        },
        current_focus: [
            "Advanced behavior tree patterns for industrial automation",
            "Machine learning integration with traditional navigation",
            "Edge case handling in production environments",
            "Scalable robotics architecture design"
        ],
        outcomes: "Developing production-ready robotics solutions, contributing to autonomous systems that operate in real industrial environments daily."
    }
};

const ProjectTemplates = {
    renderProject: (project) => {
        return `
            <div class="project-detail">
                <h2>${project.title}</h2>
                <div class="project-period">${project.period}</div>
                
                <div class="project-section">
                    <h3>Overview</h3>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-section">
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                ${project.challenges ? `
                <div class="project-section">
                    <h3>Key Challenges</h3>
                    <ul>
                        ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${project.learnings ? `
                <div class="project-section">
                    <h3>Key Learnings</h3>
                    <ul>
                        ${project.learnings.map(learning => `<li>${learning}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${project.technical_details ? `
                <div class="project-section">
                    <h3>Technical Implementation</h3>
                    <div class="technical-details">
                        ${Object.entries(project.technical_details).map(([key, value]) => `
                            <div class="detail-item">
                                <strong>${key}:</strong> ${value}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${project.code_snippets ? `
                <div class="project-section">
                    <h3>Code Examples</h3>
                    ${Object.entries(project.code_snippets).map(([title, code]) => `
                        <div class="code-example">
                            <h4>${title}</h4>
                            <pre><code>${code}</code></pre>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${project.achievements ? `
                <div class="project-section">
                    <h3>Achievements</h3>
                    <ul class="achievements-list">
                        ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="project-section">
                    <h3>Outcomes & Impact</h3>
                    <p>${project.outcomes}</p>
                </div>
                
                ${this.renderConceptExplanation(project.title)}
            </div>
        `;
    },
    
    renderConceptExplanation: (projectTitle) => {
        const concepts = {
            "Arduino Car": `
                <div class="concept-explanation">
                    <h3>🤖 Robotics Concepts Introduced</h3>
                    <div class="concept-item">
                        <h4>Dead Reckoning</h4>
                        <p>Basic navigation using wheel rotations and time - the foundation of odometry but prone to drift over time.</p>
                    </div>
                    <div class="concept-item">
                        <h4>Sensor Fusion</h4>
                        <p>Combining ultrasonic and environmental sensors for better situational awareness.</p>
                    </div>
                </div>
            `,
            "ROS Learning": `
                <div class="concept-explanation">
                    <h3>🎯 Navigation Fundamentals</h3>
                    <div class="concept-item">
                        <h4>Localization vs Odometry</h4>
                        <p><strong>Odometry:</strong> Estimates position from wheel rotations - fast but accumulates error.<br>
                        <strong>Localization:</strong> Uses sensors to correct position against a known map - slower but accurate.</p>
                    </div>
                    <div class="concept-item">
                        <h4>Transform Trees (tf)</h4>
                        <p>ROS system for managing coordinate frames - essential for relating sensor data to robot position.</p>
                    </div>
                    <div class="concept-item">
                        <h4>Path Planning</h4>
                        <p>Global planners find optimal paths, local planners handle dynamic obstacles and smooth motion.</p>
                    </div>
                </div>
            `,
            "eYantra Competition": `
                <div class="concept-explanation">
                    <h3>🏭 Multi-Robot Coordination</h3>
                    <div class="concept-item">
                        <h4>Task Scheduling</h4>
                        <p>Coordinating mobile robot positioning with arm manipulation requires precise timing and spatial awareness.</p>
                    </div>
                    <div class="concept-item">
                        <h4>Simulation vs Reality Gap</h4>
                        <p>Real robots have delays, noise, and mechanical limitations not present in simulation.</p>
                    </div>
                </div>
            `,
            "DIY AMR": `
                <div class="concept-explanation">
                    <h3>🧭 Advanced Navigation Concepts</h3>
                    <div class="concept-item">
                        <h4>SLAM (Simultaneous Localization and Mapping)</h4>
                        <p>Building a map while simultaneously determining robot position within that map - chicken and egg problem solved!</p>
                    </div>
                    <div class="concept-item">
                        <h4>Particle Filters (AMCL)</h4>
                        <p>Probabilistic localization using multiple position hypotheses that converge on the true location.</p>
                    </div>
                </div>
            `,
            "IIT Bombay Internship": `
                <div class="concept-explanation">
                    <h3>🌳 Behavior Trees in Action</h3>
                    <div class="concept-item">
                        <h4>Behavior Tree Structure</h4>
                        <p><strong>Sequence:</strong> Execute children in order, fail if any fails<br>
                        <strong>Selector:</strong> Try children until one succeeds<br>
                        <strong>Action:</strong> Leaf nodes that perform actual work</p>
                    </div>
                    <div class="concept-item">
                        <h4>Visual Servoing</h4>
                        <p>Using camera feedback to guide robot motion - like how you adjust your hand position when reaching for an object.</p>
                    </div>
                </div>
            `,
            "Rigbetech Labs": `
                <div class="concept-explanation">
                    <h3>🏢 Production Robotics</h3>
                    <div class="concept-item">
                        <h4>Custom Nav2 Plugins</h4>
                        <p>Extending ROS2 navigation with custom behaviors for specific industrial requirements and environments.</p>
                    </div>
                    <div class="concept-item">
                        <h4>Fleet Management</h4>
                        <p>Coordinating multiple robots with task allocation, collision avoidance, and resource optimization.</p>
                    </div>
                    <div class="concept-item">
                        <h4>Recovery Behaviors</h4>
                        <p>Automated responses when robots get stuck - backing up, rotating, or requesting human assistance.</p>
                    </div>
                </div>
            `
        };
        
        return concepts[projectTitle] || '';
    }
};

// Additional CSS for project modal content
const projectStyles = `
.project-detail {
    color: #fff;
    line-height: 1.6;
}

.project-detail h2 {
    color: #4ecdc4;
    margin-bottom: 10px;
    font-size: 1.8rem;
}

.project-period {
    color: #ffe66d;
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 1.1rem;
}

.project-section {
    margin-bottom: 25px;
}

.project-section h3 {
    color: #ff6b6b;
    margin-bottom: 15px;
    font-size: 1.3rem;
    border-bottom: 2px solid #ff6b6b;
    padding-bottom: 5px;
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.tech-tag {
    background: rgba(255, 255, 255, 0.1);
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.technical-details .detail-item {
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border-left: 3px solid #4ecdc4;
}

.code-example {
    margin-bottom: 20px;
}

.code-example h4 {
    color: #ffe66d;
    margin-bottom: 10px;
}

.code-example pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.code-example code {
    color: #4ecdc4;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
}

.achievements-list li {
    margin-bottom: 8px;
    padding-left: 10px;
    border-left: 2px solid #ffe66d;
}

.concept-explanation {
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 20px;
}

.concept-explanation h3 {
    color: #00ff88 !important;
    border-bottom: 2px solid #00ff88 !important;
}

.concept-item {
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.concept-item h4 {
    color: #4ecdc4;
    margin-bottom: 8px;
}

.concept-item p {
    margin: 0;
    font-size: 0.95rem;
}
`;

// Inject project styles
const projectStyleSheet = document.createElement('style');
projectStyleSheet.textContent = projectStyles;
document.head.appendChild(projectStyleSheet);
