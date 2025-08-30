class RoboticsPortfolio {
    constructor() {
        this.isLoading = true;
        this.currentMode = 'autonomous';
        this.roboticsWorld = null;
        this.behaviorTree = null;
        this.localizationMap = null;
        
        this.init();
    }

    async init() {
        await this.showLoadingScreen();
        this.setupEventListeners();
        this.initializeComponents();
        this.hideLoadingScreen();
    }

    showLoadingScreen() {
        return new Promise(resolve => {
            const progress = document.querySelector('.loading-progress');
            let width = 0;
            
            const interval = setInterval(() => {
                width += Math.random() * 10;
                if (width >= 100) {
                    width = 100;
                    progress.style.width = width + '%';
                    clearInterval(interval);
                    setTimeout(resolve, 500);
                } else {
                    progress.style.width = width + '%';
                }
            }, 100);
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            this.isLoading = false;
        }, 500);
    }

    setupEventListeners() {
        // Navigation controls
        document.getElementById('auto-mode').addEventListener('click', () => {
            this.setMode('autonomous');
        });

        document.getElementById('manual-mode').addEventListener('click', () => {
            this.setMode('manual');
        });

        document.getElementById('reset-position').addEventListener('click', () => {
            this.resetRobotPosition();
        });

        // Control panel
        this.setupControlPanel();

        // Modal
        this.setupModal();

        // Keyboard controls
        this.setupKeyboardControls();
    }

    setupControlPanel() {
        const linearKp = document.getElementById('linear-kp');
        const angularKp = document.getElementById('angular-kp');
        const controllerType = document.getElementById('controller-type');

        linearKp.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = value.toFixed(1);
            if (this.roboticsWorld) {
                this.roboticsWorld.updateLinearKp(value);
            }
        });

        angularKp.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = value.toFixed(1);
            if (this.roboticsWorld) {
                this.roboticsWorld.updateAngularKp(value);
            }
        });

        controllerType.addEventListener('change', (e) => {
            this.updateControllerDescription(e.target.value);
            if (this.roboticsWorld) {
                this.roboticsWorld.setControllerType(e.target.value);
            }
        });
    }

    updateControllerDescription(type) {
        const descriptions = {
            'dwa': 'Dynamic Window Approach - Local trajectory optimization considering robot dynamics',
            'pure-pursuit': 'Pure Pursuit - Geometric path following with lookahead distance',
            'graceful': 'Graceful Controller - Smooth motion with velocity ramping'
        };
        
        document.getElementById('controller-description').textContent = descriptions[type];
    }

    setupModal() {
        const modal = document.getElementById('project-modal');
        const closeBtn = document.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.currentMode === 'manual' && this.roboticsWorld) {
                this.roboticsWorld.handleKeyPress(e.key.toLowerCase());
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.currentMode === 'manual' && this.roboticsWorld) {
                this.roboticsWorld.handleKeyRelease(e.key.toLowerCase());
            }
        });
    }

    initializeComponents() {
        // Initialize 3D World
        this.roboticsWorld = new RoboticsWorld('robotics-world');
        
        // Initialize Behavior Tree
        this.behaviorTree = new BehaviorTreeVisualizer('behavior-tree-container');
        
        // Initialize Localization Map
        this.initLocalizationMap();
        
        // Start update loop
        this.startUpdateLoop();
    }

    initLocalizationMap() {
        const canvas = document.getElementById('localization-canvas');
        const ctx = canvas.getContext('2d');
        
        this.localizationMap = {
            canvas: canvas,
            ctx: ctx,
            odometryPath: [],
            robotPosition: { x: 100, y: 100 },
            landmarks: [
                { x: 50, y: 50, name: "Projects" },
                { x: 150, y: 50, name: "Experience" },
                { x: 50, y: 150, name: "Skills" },
                { x: 150, y: 150, name: "Contact" }
            ]
        };
        
        this.drawLocalizationMap();
    }

    drawLocalizationMap() {
        const { ctx, canvas, odometryPath, robotPosition, landmarks } = this.localizationMap;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw odometry path
        if (odometryPath.length > 1) {
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(odometryPath[0].x, odometryPath[0].y);
            for (let i = 1; i < odometryPath.length; i++) {
                ctx.lineTo(odometryPath[i].x, odometryPath[i].y);
            }
            ctx.stroke();
        }
        
        // Draw landmarks
        landmarks.forEach(landmark => {
            ctx.fillStyle = '#ffe66d';
            ctx.beginPath();
            ctx.arc(landmark.x, landmark.y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = '8px Arial';
            ctx.fillText(landmark.name, landmark.x - 15, landmark.y - 10);
        });
        
        // Draw robot position
        ctx.fillStyle = '#4ecdc4';
        ctx.beginPath();
        ctx.arc(robotPosition.x, robotPosition.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw robot direction indicator
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(robotPosition.x, robotPosition.y);
        ctx.lineTo(robotPosition.x + 15, robotPosition.y);
        ctx.stroke();
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + '-mode').classList.add('active');
        
        // Show/hide manual controls
        const manualControls = document.getElementById('manual-controls');
        if (mode === 'manual') {
            manualControls.classList.remove('hidden');
        } else {
            manualControls.classList.add('hidden');
        }
        
        // Update robotics world
        if (this.roboticsWorld) {
            this.roboticsWorld.setMode(mode);
        }
    }

    resetRobotPosition() {
        if (this.roboticsWorld) {
            this.roboticsWorld.resetPosition();
        }
        
        // Reset localization map
        this.localizationMap.odometryPath = [];
        this.localizationMap.robotPosition = { x: 100, y: 100 };
        this.drawLocalizationMap();
    }

    showProjectModal(projectData) {
        const modal = document.getElementById('project-modal');
        const detailsContainer = document.getElementById('project-details');
        
        detailsContainer.innerHTML = ProjectTemplates.renderProject(projectData);
        modal.style.display = 'block';
    }

    updateRobotStatus(position, velocity, goal) {
        document.getElementById('robot-position').textContent = 
            `X: ${position.x.toFixed(1)}, Y: ${position.y.toFixed(1)}`;
        document.getElementById('robot-velocity').textContent = 
            `Linear: ${velocity.linear.toFixed(2)}, Angular: ${velocity.angular.toFixed(2)}`;
        document.getElementById('current-goal').textContent = goal || 'None';
        
        // Update localization map
        this.updateLocalizationMap(position);
    }

    updateLocalizationMap(position) {
        const mapPos = {
            x: (position.x + 10) * 10,  // Scale and offset for map
            y: (position.z + 10) * 10
        };
        
        // Add to odometry path
        this.localizationMap.odometryPath.push({...mapPos});
        if (this.localizationMap.odometryPath.length > 50) {
            this.localizationMap.odometryPath.shift();
        }
        
        // Update robot position
        this.localizationMap.robotPosition = mapPos;
        
        this.drawLocalizationMap();
    }

    startUpdateLoop() {
        const update = () => {
            if (!this.isLoading) {
                if (this.roboticsWorld) {
                    this.roboticsWorld.update();
                }
                
                if (this.behaviorTree) {
                    this.behaviorTree.update();
                }
            }
            requestAnimationFrame(update);
        };
        update();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new RoboticsPortfolio();
});
