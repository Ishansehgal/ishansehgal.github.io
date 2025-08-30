// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Project details data
const projectDetails = {
    'eyantra': {
        title: 'E-Yantra AMR with UR5 Arm',
        description: 'Developed an autonomous mobile robot integrated with UR5 robotic arm for warehouse automation. The system navigated through facilities, identified racks, and placed boxes with precision.',
        technologies: ['ROS Noetic', 'Python', 'Gazebo', 'UR5', 'AMR Navigation'],
        challenges: 'Learning the gap between simulation and real-world robotics, dealing with sensor noise, and achieving precise manipulation.',
        outcome: 'Achieved AIR 13 rank nationally and gained hands-on experience with real robots at IIT Bombay.',
        github: 'https://github.com/your-username/eyantra-project',
        images: ['project1-1.jpg', 'project1-2.jpg']
    },
    'custom-robot': {
        title: 'Custom Differential Drive Robot',
        description: 'Built a custom autonomous robot from scratch using 4-wheel differential drive design. Implemented SLAM, localization, and autonomous navigation in real-world environments.',
        technologies: ['ROS2 Humble', '2D LiDAR', 'Wheel Encoders', 'SLAM', 'Python'],
        challenges: 'Mechanical design challenges, sensor calibration, debugging odometry, and mapping accuracy.',
        outcome: 'Successfully created detailed maps of university department and achieved reliable autonomous navigation.',
        github: 'https://github.com/your-username/custom-robot',
        images: ['project2-1.jpg', 'project2-2.jpg']
    },
    'docking': {
        title: 'Autonomous Docking System',
        description: 'Implemented autonomous docking system using ArUco markers and behavior trees. Reduced operator dependency for robot operations.',
        technologies: ['PyTrees', 'ArUco Markers', 'OpenCV', 'ROS2', 'Computer Vision'],
        challenges: 'Precise marker detection, behavior tree design, and handling edge cases in docking maneuvers.',
        outcome: 'Successfully automated docking process, reducing setup time and increasing operational efficiency.',
        github: 'https://github.com/your-username/autonomous-docking',
        images: ['project3-1.jpg', 'project3-2.jpg']
    },
    'nav2-plugins': {
        title: 'Custom Nav2 Plugins',
        description: 'Developed custom plugins for ROS2 Nav2 stack to handle specialized robot behaviors and navigation requirements for different robot types.',
        technologies: ['ROS2 Nav2', 'C++', 'Behavior Trees', 'Path Planning'],
        challenges: 'Understanding Nav2 architecture, plugin development, and testing with various robot configurations.',
        outcome: 'Created reusable navigation components used across multiple robot platforms in production.',
        github: 'https://github.com/your-username/nav2-plugins',
        images: ['project4-1.jpg', 'project4-2.jpg']
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
                        <i class="fab fa-github"></i> View Code
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

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.7)';
    }
});

// Robot animation restart on scroll
let robotAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const robot = entry.target.querySelector('.robot');
            robot.style.animation = 'none';
            robot.offsetHeight; // Trigger reflow
            robot.style.animation = 'moveRobot 8s infinite linear';
        }
    });
});

robotAnimationObserver.observe(document.querySelector('.robot-animation'));
