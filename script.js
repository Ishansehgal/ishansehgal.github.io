// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS with error handling
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Project details data
    const projectDetails = {
        'eyantra': {
            title: 'E-Yantra AMR with UR5 Arm',
            description: 'Developed an autonomous mobile robot integrated with UR5 robotic arm for warehouse automation. The system navigated through facilities, identified racks, and placed boxes with precision. Worked in simulation first, then with real robots at IIT Bombay.',
            technologies: ['ROS Humble', 'Python', 'Gazebo', 'UR5', 'AMR Navigation'],
            challenges: 'Learning the gap between simulation and real-world robotics, dealing with sensor noise, network latency in remote operation, and achieving precise manipulation.',
            outcome: 'Achieved AIR 13 rank nationally out of hundreds of teams and gained invaluable hands-on experience with real industrial robots.',
            github: 'https://github.com/Ishansehgal'
        },
        'custom-robot': {
            title: 'Custom Differential Drive Robot',
            description: 'Built a custom autonomous robot from scratch following Articulated Robotics guide. Used 4-wheel differential drive design with 2D LiDAR and repurposed laptop motherboard as the brain. Implemented SLAM, localization, and autonomous navigation.',
            technologies: ['ROS2 Humble', '2D LiDAR', 'Wheel Encoders', 'SLAM', 'Python'],
            challenges: 'Mechanical design from scratch, sensor calibration issues, debugging odometry drift, mapping accuracy, and months of troubleshooting hardware-software integration.',
            outcome: 'Successfully created detailed maps of university department, achieved reliable autonomous navigation, and gained deep understanding of robotics fundamentals.',
            github: 'https://github.com/Ishansehgal'
        },
        'docking': {
            title: 'Autonomous Docking System',
            description: 'Implemented autonomous docking system using ArUco markers and behavior trees during IIT Bombay internship. Goal was to reduce operator dependency and automate robot operations for future competition teams.',
            technologies: ['PyTrees', 'ArUco Markers', 'OpenCV', 'ROS2', 'Computer Vision'],
            challenges: 'Precise marker detection under varying lighting, behavior tree design for complex sequences, handling edge cases in docking maneuvers, and making the system robust.',
            outcome: 'Successfully automated the docking process, reducing setup time from manual intervention to fully autonomous operation, benefiting future E-Yantra teams.',
            github: 'https://github.com/Ishansehgal'
        },
        'nav2-plugins': {
            title: 'Custom Nav2 Plugins',
            description: 'Developed custom plugins for ROS2 Nav2 stack to handle specialized robot behaviors and navigation requirements for different robot types at Rigbetech Labs - from small turtlebots to large AGVs.',
            technologies: ['ROS2 Nav2', 'C++', 'Behavior Trees', 'Path Planning'],
            challenges: 'Understanding complex Nav2 architecture, plugin development patterns, testing with various robot configurations, and ensuring compatibility across different platforms.',
            outcome: 'Created reusable navigation components now used across multiple robot platforms in production, improving navigation reliability and customization.',
            github: 'https://github.com/Ishansehgal'
        }
    };

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Project modal functionality
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close');

    if (modal && modalBody && closeBtn) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project');
                const project = projectDetails[projectId];
                
                if (project) {
                    modalBody.innerHTML = `
                        <h2>${project.title}</h2>
                        <p><strong>Description:</strong> ${project.description}</p>
                        <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                        <p><strong>Challenges:</strong> ${project.challenges}</p>
                        <p><strong>Outcome:</strong> ${project.outcome}</p>
                        <div class="modal-buttons">
                            <a href="${project.github}" class="btn primary" target="_blank">
                                <i class="fab fa-github"></i> View GitHub Profile
                            </a>
                        </div>
                    `;
                    modal.style.display = 'block';
                }
            });
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.7)';
            }
        }
    });

    // Robot animation restart on scroll
    const robotAnimation = document.querySelector('.robot-animation');
    if (robotAnimation) {
        let robotAnimationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const robot = entry.target.querySelector('.robot');
                    if (robot) {
                        robot.style.animation = 'none';
                        robot.offsetHeight; // Trigger reflow
                        robot.style.animation = 'moveRobot 8s infinite linear';
                    }
                }
            });
        });

        robotAnimationObserver.observe(robotAnimation);
    }
});
