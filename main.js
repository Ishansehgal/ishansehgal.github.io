import * as THREE from 'three';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// --- WORLD ---
// Floor
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.2, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate plane to be flat
scene.add(floor);

// --- ROBOT ---
const robot = new THREE.Group();
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.5, roughness: 0.5 });
const bodyGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.5);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 0.2;
robot.add(body);

const headGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeff });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0.2, 0.5, 0);
robot.add(head);
scene.add(robot);

// --- PROJECT ZONES ---
const zones = [
    { pos: new THREE.Vector3(-10, 0.01, -5), color: 0xff0000, id: 'eyantra-info', size: new THREE.Vector3(5, 0.02, 5) },
    { pos: new THREE.Vector3(10, 0.01, -8), color: 0x00ff00, id: 'myamr-info', size: new THREE.Vector3(5, 0.02, 5) },
    { pos: new THREE.Vector3(0, 0.01, 12), color: 0x0000ff, id: 'intern-info', size: new THREE.Vector3(5, 0.02, 5) },
    { pos: new THREE.Vector3(15, 0.01, 5), color: 0xffff00, id: 'bt-info', size: new THREE.Vector3(5, 0.02, 5) },
];

zones.forEach(zoneData => {
    const zoneGeo = new THREE.BoxGeometry(zoneData.size.x, zoneData.size.y, zoneData.size.z);
    const zoneMat = new THREE.MeshBasicMaterial({ color: zoneData.color, transparent: true, opacity: 0.5 });
    const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
    zoneMesh.position.copy(zoneData.pos);
    scene.add(zoneMesh);
    zoneData.mesh = zoneMesh; // Store mesh for collision detection
});


// --- CONTROLS ---
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

const moveSpeed = 0.1;
const turnSpeed = 0.03;

// --- ODOMETRY ---
let odometryPoints = [new THREE.Vector3(robot.position.x, 0.02, robot.position.z)];
const odometryMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
let odometryLine;

function updateOdometry() {
    const lastPoint = odometryPoints[odometryPoints.length - 1];
    const currentPoint = new THREE.Vector3(robot.position.x, 0.02, robot.position.z);
    if (currentPoint.distanceTo(lastPoint) > 0.5) { // Add a point every 0.5 units
        odometryPoints.push(currentPoint);
        
        if (odometryLine) scene.remove(odometryLine);
        const odometryGeometry = new THREE.BufferGeometry().setFromPoints(odometryPoints);
        odometryLine = new THREE.Line(odometryGeometry, odometryMaterial);
        scene.add(odometryLine);
    }
}


// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Robot Movement Logic
    if (keys['ArrowUp']) {
        robot.translateZ(moveSpeed);
    }
    if (keys['ArrowDown']) {
        robot.translateZ(-moveSpeed);
    }
    if (keys['ArrowLeft']) {
        robot.rotateY(turnSpeed);
    }
    if (keys['ArrowRight']) {
        robot.rotateY(-turnSpeed);
    }

    // Camera Logic (follow robot)
    const relativeCameraOffset = new THREE.Vector3(0, 5, -8);
    const cameraOffset = relativeCameraOffset.applyMatrix4(robot.matrixWorld);
    camera.position.lerp(cameraOffset, 0.1); // Smoothly move camera
    camera.lookAt(robot.position);

    // Update Odometry Trail
    updateOdometry();

    // Zone Collision and Info Display
    let inAnyZone = false;
    document.querySelectorAll('.info-box').forEach(box => box.style.display = 'none');
    
    zones.forEach(zone => {
        const box = new THREE.Box3().setFromObject(zone.mesh);
        if (box.containsPoint(robot.position)) {
            document.getElementById(zone.id).style.display = 'block';
            inAnyZone = true;
        }
    });

    if (!inAnyZone) {
        document.getElementById('welcome-info').style.display = 'block';
    }

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();