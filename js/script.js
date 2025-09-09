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
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    const categories = card.getAttribute('data-category');
                    if (categories && categories.includes(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });
    }
});

// Project Details Loading
function loadProjectDetails(projectId) {
    const projectContent = document.getElementById('project-content');
    if (!projectContent || !projectId) return;

    const projectData = {
        'stereo-vision': {
            title: 'Stereo Vision System',
            subtitle: 'Advanced Computer Vision for Depth Estimation',
            description: 'A comprehensive stereo vision system implementing advanced computer vision algorithms for real-time depth estimation and 3D object detection.',
            video: 'videos/stereo-vision-demo.mp4', // Add your video file
            images: ['images/stereo-setup.jpg', 'images/depth-map.jpg'], // Add your images
            features: [
                'Real-time stereo image processing',
                'Depth map generation',
                'Object detection and tracking',
                'Calibration and rectification',
                'Point cloud generation'
            ],
            technologies: ['C++', 'OpenCV', 'ROS2', 'PCL', 'Camera Calibration'],
            challenges: 'The main challenges involved handling camera calibration precision, optimizing real-time processing, and dealing with varying lighting conditions.',
            implementation: 'The system uses stereo camera pairs to capture synchronized images, applies rectification algorithms, and computes disparity maps for depth estimation. Advanced filtering techniques ensure accurate results.',
            results: 'Achieved sub-centimeter accuracy in depth estimation with real-time processing at 30 FPS.'
        },
        'navigation-system': {
            title: 'ROS2 Autonomous Navigation',
            subtitle: 'Complete Navigation Stack Implementation',
            description: 'A full autonomous navigation system built on ROS2 with custom behavior trees, SLAM integration, and advanced path planning.',
            video: 'videos/navigation-demo.mp4',
            images: ['images/robot-navigation.jpg', 'images/slam-map.jpg'],
            features: [
                'SLAM mapping and localization',
                'Dynamic path planning',
                'Obstacle avoidance',
                'Behavior tree control',
                'Real-time monitoring'
            ],
            technologies: ['ROS2', 'Nav2', 'SLAM', 'Behavior Trees', 'C++', 'Python'],
            challenges: 'Complex integration of multiple navigation components, real-time performance optimization, and robust error handling.',
            implementation: 'Built using ROS2 Nav2 stack with custom behavior tree nodes for decision making and monitoring. Integrated SLAM for real-time mapping.',
            results: 'Successfully navigated complex environments with 95% success rate in reaching target destinations.'
        },
        // Add more project data...
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
                <h2>Results</h2>
                <p>${project.results}</p>
            </div>
        </div>
    `;
}

// Algorithm Modal Functions
function openAlgorithmModal(algorithmId) {
    const modal = document.getElementById('algorithmModal');
    const modalTitle = document.getElementById('modalTitle');
    const videoContainer = document.getElementById('videoContainer');
    const explanationContainer = document.getElementById('algorithmExplanation');

    const algorithmData = {
        'astar': {
            title: 'A* Pathfinding Algorithm',
            video: 'videos/astar-demo.mp4',
            explanation: `
                <h3>How A* Works</h3>
                <p>The A* algorithm finds the shortest path between nodes using a heuristic function. It's widely used in robotics for navigation and path planning.</p>
                <h4>Key Components:</h4>
                <ul>
                    <li><strong>Open Set:</strong> Nodes to be evaluated</li>
                    <li><strong>Closed Set:</strong> Nodes already evaluated</li>
                    <li><strong>Heuristic Function:</strong> Estimates cost to goal</li>
                    <li><strong>Cost Function:</strong> Actual cost from start</li>
                </ul>
                <p>This visualization shows how A* explores the search space efficiently by using both actual and estimated costs.</p>
            `
        },
        'slam': {
            title: 'SLAM Algorithm Visualization',
            video: 'videos/slam-demo.mp4',
            explanation: `
                <h3>Simultaneous Localization and Mapping</h3>
                <p>SLAM solves the problem of building a map while simultaneously tracking the robot's location within that map.</p>
                <h4>Core Concepts:</h4>
                <ul>
                    <li><strong>Localization:</strong> Determining robot position</li>
                    <li><strong>Mapping:</strong> Building environment representation</li>
                    <li><strong>Loop Closure:</strong> Recognizing visited areas</li>
                    <li><strong>Bundle Adjustment:</strong> Optimizing trajectory and map</li>
                </ul>
            `
        },
        // Add more algorithm explanations...
    };

    const algorithm = algorithmData[algorithmId];
    if (!algorithm) return;

    modalTitle.textContent = algorithm.title;
    
    if (algorithm.video) {
        videoContainer.innerHTML = `
            <video controls style="width: 100%; border-radius: 8px;">
                <source src="${algorithm.video}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        videoContainer.innerHTML = '<p>Video not available yet.</p>';
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

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});
