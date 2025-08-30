class RoboticsWorld {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
        
        this.robot = null;
        this.world = null;
        this.currentMode = 'autonomous';
        this.currentGoal = null;
        this.autonomousPath = [];
        this.currentPathIndex = 0;
        
        // Robot parameters
        this.robotPosition = new THREE.Vector3(0, 0, 0);
        this.robotRotation = 0;
        this.robotVelocity = { linear: 0, angular: 0 };
        this.linearKp = 1.0;
        this.angularKp = 1.5;
        this.controllerType = 'dwa';
        
        // Manual control state
        this.keys = {};
        
        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLighting();
        this.createWorld();
        this.createRobot();
        this.setupAutonomousPath();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 0);
    }

    setupCamera() {
        this.camera.position.set(0, 15, 15);
        this.camera.lookAt(0, 0, 0);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for ambiance
        const pointLight1 = new THREE.PointLight(0x00ff88, 0.5, 50);
        pointLight1.position.set(-10, 5, -10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00ccff, 0.5, 50);
        pointLight2.position.set(10, 5, 10);
        this.scene.add(pointLight2);
    }

    createWorld() {
        this.world = new THREE.Group();
        
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(40, 40);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c3e50,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.world.add(floor);

        // Create project zones
        this.createProjectZones();
        
        // Create obstacles
        this.createObstacles();
        
        this.scene.add(this.world);
    }

    createProjectZones() {
        const projects = [
            { name: "Arduino Car", position: [-8, 0.5, -8], color: 0xff6b6b },
            { name: "ROS Learning", position: [8, 0.5, -8], color: 0x4ecdc4 },
            { name: "eYantra Competition", position: [-8, 0.5, 8], color: 0xffe66d },
            { name: "DIY AMR", position: [8, 0.5, 8], color: 0x9b59b6 },
            { name: "IIT Bombay Internship", position: [0, 0.5, -12], color: 0xe67e22 },
            { name: "Rigbetech Labs", position: [0, 0.5, 12], color: 0x00ff88 }
        ];

        projects.forEach(project => {
            // Create zone platform
            const zoneGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 16);
            const zoneMaterial = new THREE.MeshLambertMaterial({ 
                color: project.color,
                transparent: true,
                opacity: 0.7
            });
            const zone = new THREE.Mesh(zoneGeometry, zoneMaterial);
            zone.position.set(...project.position);
            zone.castShadow = true;
            zone.userData = { type: 'project', name: project.name };
            
            // Create label
            const textGeometry = new THREE.RingGeometry(0.5, 1.5, 8);
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            const label = new THREE.Mesh(textGeometry, textMaterial);
            label.position.set(project.position[0], project.position[1] + 1, project.position[2]);
            label.rotation.x = -Math.PI / 2;
            
            this.world.add(zone);
            this.world.add(label);
        });
    }

    createObstacles() {
        // Create some obstacles for navigation demonstration
        const obstacles = [
            { position: [-3, 0.5, 0], size: [1, 1, 1] },
            { position: [3, 0.5, 0], size: [1, 1, 1] },
            { position: [0, 0.5, 3], size: [1, 1, 1] },
            { position: [0, 0.5, -3], size: [1, 1, 1] }
        ];

        obstacles.forEach(obstacle => {
            const geometry = new THREE.BoxGeometry(...obstacle.size);
            const material = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obstacle.position);
            mesh.castShadow = true;
            mesh.userData = { type: 'obstacle' };
            this.world.add(mesh);
        });
    }

    createRobot() {
        this.robot = new THREE.Group();
        
        // Robot body
        const bodyGeometry = new THREE.BoxGeometry(1, 0.3, 1.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x34495e });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        body.castShadow = true;
        this.robot.add(body);

        // Robot wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
        
        const positions = [
            [-0.6, 0.2, -0.5], [0.6, 0.2, -0.5], 
            [-0.6, 0.2, 0.5], [0.6, 0.2, 0.5]
        ];
        
        positions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            this.robot.add(wheel);
        });

        // Direction indicator
        const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
        const arrowMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff88 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.position.set(0, 0.8, 0.5);
        arrow.rotation.x = Math.PI / 2;
        this.robot.add(arrow);

        // Lidar sensor (visual representation)
        const lidarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
        const lidarMaterial = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
        const lidar = new THREE.Mesh(lidarGeometry, lidarMaterial);
        lidar.position.set(0, 0.8, 0);
        this.robot.add(lidar);

        this.robot.position.copy(this.robotPosition);
        this.scene.add(this.robot);
    }

    setupAutonomousPath() {
        this.autonomousPath = [
            new THREE.Vector3(-8, 0, -8),  // Arduino Car
            new THREE.Vector3(8, 0, -8),   // ROS Learning
            new THREE.Vector3(-8, 0, 8),   // eYantra Competition
            new THREE.Vector3(8, 0, 8),    // DIY AMR
            new THREE.Vector3(0, 0, -12),  // IIT Bombay Internship
            new THREE.Vector3(0, 0, 12),   // Rigbetech Labs
            new THREE.Vector3(0, 0, 0)     // Center
        ];
        this.currentPathIndex = 0;
        this.currentGoal = this.autonomousPath[0];
    }

    setMode(mode) {
        this.currentMode = mode;
        if (mode === 'autonomous' && this.autonomousPath.length > 0) {
            this.currentGoal = this.autonomousPath[this.currentPathIndex];
        } else {
            this.currentGoal = null;
        }
    }

    setControllerType(type) {
        this.controllerType = type;
    }

    updateLinearKp(value) {
        this.linearKp = value;
    }

    updateAngularKp(value) {
        this.angularKp = value;
    }

    handleKeyPress(key) {
        this.keys[key] = true;
    }

    handleKeyRelease(key) {
        this.keys[key] = false;
    }

    resetPosition() {
        this.robotPosition.set(0, 0, 0);
        this.robotRotation = 0;
        this.robotVelocity = { linear: 0, angular: 0 };
        this.robot.position.copy(this.robotPosition);
        this.robot.rotation.y = this.robotRotation;
        this.currentPathIndex = 0;
        if (this.autonomousPath.length > 0) {
            this.currentGoal = this.autonomousPath[0];
        }
    }

    update() {
        if (this.currentMode === 'autonomous') {
            this.updateAutonomousMovement();
        } else {
            this.updateManualMovement();
        }
        
        this.updateRobotPhysics();
        this.checkProjectZoneProximity();
        
        // Update portfolio status
        if (window.portfolio) {
            const goalName = this.currentGoal ? 
                this.getGoalName(this.currentGoal) : 'None';
            window.portfolio.updateRobotStatus(
                this.robotPosition, 
                this.robotVelocity, 
                goalName
            );
        }
    }

    updateAutonomousMovement() {
        if (!this.currentGoal) return;

        const distance = this.robotPosition.distanceTo(this.currentGoal);
        
        if (distance < 1.0) {
            // Reached current goal, move to next
            this.currentPathIndex = (this.currentPathIndex + 1) % this.autonomousPath.length;
            this.currentGoal = this.autonomousPath[this.currentPathIndex];
            return;
        }

        // Calculate movement based on controller type
        const direction = new THREE.Vector3()
            .subVectors(this.currentGoal, this.robotPosition)
            .normalize();

        const targetAngle = Math.atan2(direction.x, direction.z);
        let angleDiff = targetAngle - this.robotRotation;
        
        // Normalize angle difference
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        // Apply controller-specific logic
        switch (this.controllerType) {
            case 'dwa':
                this.applyDWAController(direction, angleDiff, distance);
                break;
            case 'pure-pursuit':
                this.applyPurePursuitController(direction, angleDiff, distance);
                break;
            case 'graceful':
                this.applyGracefulController(direction, angleDiff, distance);
                break;
        }
    }

    applyDWAController(direction, angleDiff, distance) {
        // Simplified DWA - considers velocity constraints
        const maxLinearVel = 2.0;
        const maxAngularVel = 1.5;
        
        this.robotVelocity.angular = Math.sign(angleDiff) * 
            Math.min(Math.abs(angleDiff) * this.angularKp, maxAngularVel);
        
        // Reduce linear velocity when turning
        const angularFactor = 1.0 - Math.abs(angleDiff) / Math.PI;
        this.robotVelocity.linear = Math.min(
            distance * this.linearKp * angularFactor, 
            maxLinearVel
        );
    }

    applyPurePursuitController(direction, angleDiff, distance) {
        // Pure pursuit with lookahead
        const lookaheadDistance = 2.0;
        this.robotVelocity.angular = angleDiff * this.angularKp;
        this.robotVelocity.linear = Math.min(distance * this.linearKp, 1.5);
    }

    applyGracefulController(direction, angleDiff, distance) {
        // Graceful controller with smooth acceleration
        const targetLinearVel = Math.min(distance * this.linearKp, 1.0);
        const targetAngularVel = angleDiff * this.angularKp;
        
        // Smooth acceleration
        this.robotVelocity.linear += (targetLinearVel - this.robotVelocity.linear) * 0.1;
        this.robotVelocity.angular += (targetAngularVel - this.robotVelocity.angular) * 0.1;
    }

    updateManualMovement() {
        const linearSpeed = 2.0;
        const angularSpeed = 1.5;
        
        this.robotVelocity.linear = 0;
        this.robotVelocity.angular = 0;
        
        if (this.keys['w']) this.robotVelocity.linear = linearSpeed;
        if (this.keys['s']) this.robotVelocity.linear = -linearSpeed;
        if (this.keys['a']) this.robotVelocity.angular = angularSpeed;
        if (this.keys['d']) this.robotVelocity.angular = -angularSpeed;
        if (this.keys['q']) this.robotVelocity.angular = angularSpeed;
        if (this.keys['e']) this.robotVelocity.angular = -angularSpeed;
        if (this.keys[' ']) {
            this.robotVelocity.linear = 0;
            this.robotVelocity.angular = 0;
        }
    }

    updateRobotPhysics() {
        const dt = 0.016; // 60 FPS
        
        // Update rotation
        this.robotRotation += this.robotVelocity.angular * dt;
        
        // Update position
        const moveX = Math.sin(this.robotRotation) * this.robotVelocity.linear * dt;
        const moveZ = Math.cos(this.robotRotation) * this.robotVelocity.linear * dt;
        
        this.robotPosition.x += moveX;
        this.robotPosition.z += moveZ;
        
        // Keep robot within bounds
        this.robotPosition.x = Math.max(-18, Math.min(18, this.robotPosition.x));
        this.robotPosition.z = Math.max(-18, Math.min(18, this.robotPosition.z));
        
        // Update robot mesh
        this.robot.position.copy(this.robotPosition);
        this.robot.rotation.y = this.robotRotation;
    }

    checkProjectZoneProximity() {
        // Check if robot is near any project zones
        this.world.children.forEach(child => {
            if (child.userData.type === 'project') {
                const distance = this.robotPosition.distanceTo(child.position);
                if (distance < 3.0 && this.currentMode === 'autonomous') {
                    // Trigger project information display
                    this.showProjectInfo(child.userData.name);
                }
            }
        });
    }

    showProjectInfo(projectName) {
        // This would trigger the project modal in the main portfolio class
        if (window.portfolio && ProjectData[projectName]) {
            window.portfolio.showProjectModal(ProjectData[projectName]);
        }
    }

    getGoalName(goal) {
        const goalNames = [
            "Arduino Car", "ROS Learning", "eYantra Competition", 
            "DIY AMR", "IIT Bombay Internship", "Rigbetech Labs", "Center"
        ];
        const index = this.autonomousPath.findIndex(p => p.equals(goal));
        return index !== -1 ? goalNames[index] : "Unknown";
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
