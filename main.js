import * as THREE from 'three';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.position.set(10, 15, 10);
scene.add(directionalLight);

// --- WORLD ---
const floorGeometry = new THREE.PlaneGeometry(60, 60);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, metalness: 0.1, roughness: 0.9 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// --- NEW MODERN ROBOT MODEL ---
const robot = new THREE.Group();

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.8, roughness: 0.4 });
const accentMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.6, roughness: 0.5 });
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

// Body
const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.3, 32);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 0.35;
robot.add(body);

// Head / Sensor Mast
const headGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 32);
const head = new THREE.Mesh(headGeometry, accentMaterial);
head.position.y = 0.7;
robot.add(head);

// Antenna
const antennaGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const antenna = new THREE.Mesh(antennaGeometry, bodyMaterial);
antenna.position.y = 0.95;
robot.add(antenna);

// Wheels
const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 24);
const wheelPositions = [
    { x: 0.4, y: 0.2, z: 0.3 }, { x: -0.4, y: 0.2, z: 0.3 },
    { x: 0.4, y: 0.2, z: -0.3 }, { x: -0.4, y: 0.2, z: -0.3 }
];
wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, pos.y, pos.z);
    robot.add(wheel);
});
scene.add(robot);


// --- PROJECT ZONES (Updated to match your journey) ---
const zones = [
    { pos: new THREE.Vector3(0, 0.01, -8), color: 0x00ff00, id: 'genesis-info', size: new THREE.Vector3(6, 0.02, 6) },
    { pos: new THREE.Vector3(-12, 0.01, 0), color: 0xff0000, id: 'eyantra-info', size: new THREE.Vector3(6, 0.02, 6) },
    { pos: new THREE.Vector3(0, 0.01, 12), color: 0xffff00, id: 'myamr-info', size: new THREE.Vector3(6, 0.02, 6) },
    { pos: new THREE.Vector3(12, 0.01, 0), color: 0x0000ff, id: 'intern-info', size: new THREE.Vector3(6, 0.02, 6) },
    { pos: new THREE.Vector3(0, 0.01, -20), color: 0xff00ff, id: 'pro-info', size: new THREE.Vector3(6, 0.02, 6) },
];

zones.forEach(zoneData => {
    const zoneGeo = new THREE.BoxGeometry(zoneData.size.x, zoneData.size.y, zoneData.size.z);
    const zoneMat = new THREE.MeshBasicMaterial({ color: zoneData.color, transparent: true, opacity: 0.5 });
    const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
    zoneMesh.position.copy(zoneData.pos);
    scene.add(zoneMesh);
    zoneData.mesh = zoneMesh;
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
    if (currentPoint.distanceTo(lastPoint) > 0.5) {
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
    if (keys['ArrowUp']) robot.translateZ(moveSpeed);
    if (keys['ArrowDown']) robot.translateZ(-moveSpeed);
    if (keys['ArrowLeft']) robot.rotateY(turnSpeed);
    if (keys['ArrowRight']) robot.rotateY(-turnSpeed);

    // Camera Logic
    const relativeCameraOffset = new THREE.Vector3(0, 6, -10);
    const cameraOffset = relativeCameraOffset.applyMatrix4(robot.matrixWorld);
    camera.position.lerp(cameraOffset, 0.1);
    camera.lookAt(robot.position);

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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();