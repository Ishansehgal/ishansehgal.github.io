// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Project Details Loading
function loadProjectDetails(projectId) {
    const projectContent = document.getElementById('project-content');
    if (!projectContent || !projectId) return;

    const projectData = {
        'eyantra-competition': {
            title: 'eYantra Robotics Competition',
            subtitle: 'National Robotics Competition • AIR 13',
            description: 'A prestigious national-level robotics competition organized by IIT Bombay featuring autonomous mobile robots and robotic arms for warehouse automation scenarios.',
            video: 'videos/eyantra-demo.mp4',
            images: ['images/eyantra-robot.jpg', 'images/eyantra-simulation.jpg'],
            features: [
                'Autonomous Mobile Robot (AMR) navigation',
                'UR5 robotic arm integration',
                'Warehouse rack automation',
                'Box placement and sorting',
                'Multi-stage competition format',
                'Real robot deployment at IIT Bombay'
            ],
            technologies: ['ROS Noetic', 'Gazebo', 'UR5 Arm', 'Python', 'C++', 'Computer Vision'],
            challenges: 'Transitioning from simulation to real-world deployment revealed significant gaps between theoretical and practical robotics. Hardware limitations, sensor noise, and timing constraints required extensive debugging and adaptation.',
            implementation: 'Started with simulation-based development in Gazebo, progressed through multiple competition stages, and finally deployed code on actual robots at IIT Bombay with remote access.',
            results: 'Secured AIR 13 rank nationally, gained invaluable real-world robotics experience, and developed a deep understanding of the simulation-to-reality gap.'
        },
        'custom-robot': {
            title: 'Custom Autonomous Robot',
            subtitle: 'Self-Built Differential Drive Robot',
            description: 'A completely self-designed and built autonomous robot featuring differential drive configuration with advanced navigation capabilities.',
            video: 'videos/custom-robot-demo.mp4',
            images: ['images/custom-robot-build.jpg', 'images/department-map.jpg'],
            features: [
                '4-wheel differential drive system',
                '2D LiDAR for mapping and localization',
                'Wheel encoders for odometry',
                'ROS2 Foxy navigation stack',
                'Custom mechanical design',
                'Department mapping and navigation'
            ],
            technologies: ['ROS2 Foxy', '2D LiDAR', 'Wheel Encoders', 'SLAM', 'Hardware Integration', 'Mechanical Design'],
            challenges: 'Building a mechanically robust platform was challenging. Calibration issues, sensor alignment, and odometry tuning required months of debugging and iteration.',
            implementation: 'Followed Articulated Robotics guides but adapted for 4-wheel configuration. Integrated sensors with laptop as main computer, implemented full navigation stack.',
            results: 'Successfully created functional autonomous robot capable of mapping department layout and performing localization-based navigation.'
        },
        'autonomous-docking': {
            title: 'Autonomous Docking System',
            subtitle: 'ArUco Marker-Based Precision Docking',
            description: 'An advanced autonomous docking system developed during IIT Bombay internship to automate robot workflows for future competition teams.',
            video: 'videos/docking-demo.mp4',
            images: ['images/aruco-detection.jpg', 'images/docking-sequence.jpg'],
            features: [
                'ArUco marker detection and tracking',
                'Precision docking algorithms',
                'Behavior tree control architecture',
                'Automated workflow management',
                'PyTree integration',
                'Operator independence'
            ],
            technologies: ['ArUco Markers', 'OpenCV', 'PyTree', 'Behavior Trees', 'Computer Vision', 'ROS'],
            challenges: 'Achieving centimeter-level docking precision required careful camera calibration, robust marker detection, and sophisticated control algorithms.',
            implementation: 'Implemented computer vision pipeline for marker detection, developed behavior tree logic for decision making, and created automated sequences.',
            results: 'Enabled future competition teams to use robots with minimal operator intervention, significantly reducing setup time and human error.'
        },
        'ros-learning': {
            title: 'ROS Navigation Learning Project',
            subtitle: 'First Steps into ROS Development',
            description: 'Initial ROS learning project through RigBetel Labs mentorship, covering CAD design, URDF integration, and navigation fundamentals.',
            video: 'videos/turtle-shapes.mp4',
            images: ['images/fusion360-model.jpg', 'images/turtlesim-art.jpg'],
            features: [
                'Fusion 360 CAD modeling',
                'URDF file creation and export',
                'ROS Noetic navigation stack',
                'TurtleSim creative programming',
                'Localization and odometry concepts',
                'Navigation fundamentals'
            ],
            technologies: ['ROS Noetic', 'Fusion 360', 'URDF', 'Navigation Stack', 'TurtleSim', 'Python'],
            challenges: 'Learning ROS concepts from scratch, understanding coordinate frames, and grasping the relationship between simulation and real-world applications.',
            implementation: 'Created differential drive robot model in Fusion 360, exported to URDF, integrated with ROS navigation stack, and experimented with TurtleSim.',
            results: 'Established strong foundation in ROS development, gained confidence in robotics programming, and developed passion for autonomous systems.'
        },
        'arduino-car': {
            title: 'Arduino Obstacle Avoidance Car',
            subtitle: 'First College Robotics Project',
            description: 'Initial robotics project featuring obstacle avoidance capabilities with environmental monitoring sensors and custom power management.',
            video: 'videos/arduino-car-demo.mp4',
            images: ['images/arduino-car.jpg', 'images/battery-pack.jpg'],
            features: [
                'Ultrasonic sensor obstacle detection',
                'Custom battery pack design',
                'AQI (Air Quality Index) monitoring',
                'Gas sensor integration',
                'Arduino-based control system',
                'Multi-sensor data fusion'
            ],
            technologies: ['Arduino', 'Ultrasonic Sensors', 'AQI Sensor', 'Gas Sensors', 'Electronics', 'C++'],
            challenges: 'Understanding electronics fundamentals, power management, sensor integration, and realizing the limitations of Arduino for complex autonomous systems.',
            implementation: 'Integrated multiple sensors with Arduino, designed custom battery solution, implemented basic obstacle avoidance algorithms.',
            results: 'Gained practical electronics experience, understood hardware-software integration, and recognized the need for more advanced robotics platforms.'
        },
        'enterprise-robotics': {
            title: 'Enterprise Robotics Development',
            subtitle: 'Professional Robotics at RigBetel Labs',
            description: 'Professional robotics development working on various commercial robots from small TortoiseBots to large industrial AGVs and AMRs.',
            video: 'videos/enterprise-robots.mp4',
            images: ['images/tortoisebot.jpg', 'images/agv-fleet.jpg'],
            features: [
                'Multiple robot platform support',
                'ROS2 Nav2 custom plugins',
                'Behavior tree architectures',
                'Production-grade systems',
                'AGV/AMR fleet management',
                'Robotic arm integration'
            ],
            technologies: ['ROS2 Humble', 'Nav2', 'Behavior Trees', 'Production Systems', 'AGV/AMR', 'Industrial Robotics'],
            challenges: 'Scaling from hobby projects to enterprise-grade systems, handling production requirements, reliability, and real-world deployment constraints.',
            implementation: 'Developed custom navigation plugins, implemented sophisticated behavior trees, worked on diverse robot platforms from research to industrial applications.',
            results: 'Gained professional robotics development experience, contributed to commercial robot deployments, and advanced from intern to full-time developer role.'
        }
    };

    const project = projectData[projectId];
    if (!project) {
        projectContent.innerHTML = '<p>Project not found.</p>';
        return;
    }

    projectContent.innerHTML = `
        <div class="project-detail-content">
            <div class="project-hero">
                <h1>${project.title}</h1>
                <p class="hero-subtitle">${project.subtitle}</p>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            </div>

            ${project.video ? `
                <div class="project-media">
                    <video class="project-video" controls>
                        <source src="${project.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            ` : ''}

            ${project.images && project.images.length > 0 ? `
                <div class="project-media">
                    <div class="project-images">
                        ${project.images.map(img => `<img src="${img}" alt="Project Image">`).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="project-section">
                <h2>Key Features</h2>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div class="project-section">
                <h2>Technical Implementation</h2>
                <p>${project.implementation}</p>
            </div>

            <div class="project-section">
                <h2>Challenges & Solutions</h2>
                <p>${project.challenges}</p>
            </div>

            <div class="project-section">
                <h2>Results & Impact</h2>
                <p>${project.results}</p>
            </div>
        </div>
    `;
}

// Algorithm Modal Functions (Updated for 3 algorithms)
function openAlgorithmModal(algorithmId) {
    const modal = document.getElementById('algorithmModal');
    const modalTitle = document.getElementById('modalTitle');
    const videoContainer = document.getElementById('videoContainer');
    const explanationContainer = document.getElementById('algorithmExplanation');

    const algorithmData = {
        'astar': {
            title: 'A* Pathfinding Algorithm',
            video: 'videos/astar-visualization.mp4',
            explanation: `
                <h3>A* Pathfinding Visualization</h3>
                <p>The A* algorithm is a fundamental pathfinding algorithm used extensively in robotics for navigation and autonomous systems. This visualization demonstrates how A* efficiently finds optimal paths by combining actual costs with heuristic estimates.</p>
                
                <h4>Algorithm Components:</h4>
                <ul>
                    <li><strong>Open Set:</strong> Nodes to be evaluated, prioritized by f-cost</li>
                    <li><strong>Closed Set:</strong> Already evaluated nodes</li>
                    <li><strong>G-cost:</strong> Actual distance from start node</li>
                    <li><strong>H-cost:</strong> Heuristic estimate to goal (Manhattan/Euclidean distance)</li>
                    <li><strong>F-cost:</strong> G-cost + H-cost (total estimated cost)</li>
                </ul>
                
                <h4>Robotics Applications:</h4>
                <p>In robotics, A* is used for global path planning in navigation stacks, enabling robots to find optimal routes while avoiding obstacles in known environments.</p>
                
                <div class="code-example">
                    <h4>Basic A* Structure:</h4>
                    <pre><code>while open_set not empty:
    current = node with lowest f_cost
    if current == goal:
        return reconstruct_path()
    
    for neighbor in current.neighbors:
        if neighbor in closed_set:
            continue
        
        tentative_g = current.g + distance(current, neighbor)
        if tentative_g < neighbor.g:
            update_path(neighbor, current, tentative_g)</code></pre>
                </div>
            `
        },
        'slam': {
            title: 'SLAM Algorithm Visualization',
            video: 'videos/slam-visualization.mp4',
            explanation: `
                <h3>Simultaneous Localization and Mapping (SLAM)</h3>
                <p>SLAM is one of the most important problems in robotics - building a map of an unknown environment while simultaneously keeping track of the robot's location within that map.</p>
                
                <h4>SLAM Process:</h4>
                <ul>
                    <li><strong>Sensor Data Collection:</strong> LiDAR, cameras, IMU data</li>
                    <li><strong>Motion Estimation:</strong> Predicting robot movement</li>
                    <li><strong>Landmark Detection:</strong> Identifying environmental features</li>
                    <li><strong>Data Association:</strong> Matching current observations with map</li>
                    <li><strong>Map Update:</strong> Adding new information to the map</li>
                    <li><strong>Loop Closure:</strong> Recognizing previously visited locations</li>
                </ul>
                
                <h4>Types of SLAM:</h4>
                <p><strong>2D SLAM:</strong> Uses laser scanners for planar environments</p>
                <p><strong>3D SLAM:</strong> Uses 3D sensors for full spatial mapping</p>
                <p><strong>Visual SLAM:</strong> Camera-based mapping and localization</p>
                
                <h4>Real-World Applications:</h4>
                <p>This visualization shows how robots incrementally build maps while navigating unknown environments, essential for autonomous vehicles, warehouse robots, and exploration rovers.</p>
            `
        },
        'stereo': {
            title: 'Stereo Vision Processing',
            video: 'videos/stereo-vision-demo.mp4',
            explanation: `
                <h3>Stereo Vision Depth Estimation</h3>
                <p>Stereo vision mimics human binocular vision to perceive depth by analyzing the differences between two camera views of the same scene.</p>
                
                <h4>Stereo Vision Pipeline:</h4>
                <ul>
                    <li><strong>Camera Calibration:</strong> Determining internal camera parameters</li>
                    <li><strong>Image Rectification:</strong> Aligning stereo image pairs</li>
                    <li><strong>Correspondence Matching:</strong> Finding matching pixels between images</li>
                    <li><strong>Disparity Calculation:</strong> Computing pixel displacement</li>
                    <li><strong>Depth Triangulation:</strong> Converting disparity to 3D coordinates</li>
                    <li><strong>Point Cloud Generation:</strong> Creating 3D representation</li>
                </ul>
                
                <h4>Key Concepts:</h4>
                <p><strong>Baseline:</strong> Distance between cameras affects depth accuracy</p>
                <p><strong>Disparity:</strong> Pixel difference = depth information</p>
                <p><strong>Epipolar Geometry:</strong> Mathematical relationship between stereo views</p>
                
                <h4>Robotics Applications:</h4>
                <p>Essential for robot perception, obstacle avoidance, 3D mapping, and manipulation tasks. Provides dense depth information for navigation and object interaction.</p>
                
                <div class="math-formula">
                    <h4>Depth Calculation:</h4>
                    <p><strong>Depth = (focal_length × baseline) / disparity</strong></p>
                </div>
            `
        }
    };

    const algorithm = algorithmData[algorithmId];
    if (!algorithm) return;

    modalTitle.textContent = algorithm.title;
    
    if (algorithm.video) {
        videoContainer.innerHTML = `
            <video controls style="width: 100%; border-radius: 8px;">
                <source src="${algorithm.video}" type="video/mp4">
                Your browser does not support the video tag.
                <p>Please add your ${algorithmId} visualization video to the videos folder.</p>
            </video>
        `;
    } else {
        videoContainer.innerHTML = '<p>Video will be available soon. Please add your Manim visualization videos to the videos folder.</p>';
    }

    explanationContainer.innerHTML = algorithm.explanation;
    modal.style.display = 'block';
}

function closeAlgorithmModal() {
    const modal = document.getElementById('algorithmModal');
    modal.style.display = 'none';
    
    // Stop video if playing
    const video = modal.querySelector('video');
    if (video) {
        video.pause();
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('algorithmModal');
    if (event.target === modal) {
        closeAlgorithmModal();
    }
});

// Smooth scrolling for internal links
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

// Load project details based on URL parameter
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId) {
        loadProjectDetails(projectId);
    }
});
