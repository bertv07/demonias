import * as THREE from "three";

let clock = new THREE.Clock();
let delta = 0;

const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x09043d);
scene.fog = new THREE.Fog(0xc0f0ff, 0.0015);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z =700;

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.classList.add('smoke');
document.body.appendChild(renderer.domElement);
    
const light = new THREE.HemisphereLight(0xffffff, 0x404040, 1);
scene.add(light);

const smokeTexture = new THREE.TextureLoader().load("../assets/img/smoke-12.png");
smokeTexture.colorSpace = THREE.SRGBColorSpace;
const smokeGeometry = new THREE.PlaneGeometry(300, 300);

const smokeMaterial = new THREE.MeshBasicMaterial({
    map: smokeTexture,
    transparent: true,
    opacity: 0.05
});

let smokeParticles = [];
for (let i = 0; i < 150; i++) {
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
    smoke.scale.set(2, 2, 2);
    
    // Posición inicial centrada
    smoke.position.set(
        (Math.random() - 0.5) * 1000,  // Centrado horizontalmente
        (Math.random() - 0.5) * 1000,  // Centrado verticalmente
        (Math.random() - 0.5) * 1000   // Profundidad aleatoria
    );
    
    smoke.rotation.z = Math.random() * 360;
    smoke.userData = {
        speed: 0.2 + Math.random() * 0.3,  // Reducir velocidad de movimiento
        rotationSpeed: (Math.random() - 0.5) * 0.02,  // Reducir velocidad de rotación
        initialX: smoke.position.x  // Guardamos la posición X inicial
    };
    
    smokeParticles.push(smoke);
    scene.add(smoke);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    delta = clock.getDelta();
    requestAnimationFrame(animate);
    
    smokeParticles.forEach((smoke, i) => {
        // Mover el humo basado en el scroll
        smoke.position.x = smoke.userData.initialX - scrollX * 2;
        
        // Rotación suave
        smoke.rotation.z += smoke.userData.rotationSpeed;
    });
    
    renderer.render(scene, camera);
}

let scrollX = 0;

// Escuchar el evento de scroll
window.addEventListener('scroll', () => {
    scrollX = window.scrollY * 0.05; // Reducir la velocidad del movimiento con el scroll
});

// Iniciar animación
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

// Initial call to set sizes
onWindowResize();

// Start animation
animate();
