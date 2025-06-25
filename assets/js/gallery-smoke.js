import * as THREE from "three";

function initGallerySmoke() {
    const gallery = document.querySelector('.galeria');
    if (!gallery) return;
    
    // Obtener dimensiones de la galería
    const galleryRect = gallery.getBoundingClientRect();
    
    // Crear escena
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xc0f0ff, 0.0015);

    // Configurar cámara
    const camera = new THREE.PerspectiveCamera(45, galleryRect.width / galleryRect.height, 0.1, 1000);
    camera.position.z = 700;
    camera.position.y = 550;

    // Configurar renderizador
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        canvas: document.createElement('canvas')
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(galleryRect.width, galleryRect.height);
    renderer.domElement.classList.add('galeria-smoke');
    gallery.insertBefore(renderer.domElement, gallery.firstChild);
    
    // Configurar posición absoluta para el canvas
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    // Configurar luces
    const light = new THREE.HemisphereLight(0xffffff, 0x404040, 1);
    scene.add(light);

    // Cargar textura de humo
    const smokeTexture = new THREE.TextureLoader().load("../assets/img/smoke-12.png");
    smokeTexture.colorSpace = THREE.SRGBColorSpace;
    const smokeGeometry = new THREE.PlaneGeometry(300, 300);

    const smokeMaterial = new THREE.MeshBasicMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
    });

    // Crear partículas de humo
    let smokeParticles = [];
    const smokeCount = 200;

    for (let i = 0; i < smokeCount; i++) {
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
        smoke.scale.set(2, 2, 2);
        
        // Posición inicial aleatoria dentro del área de la galería
        smoke.position.set(
            (Math.random() - 0.5) * 1500,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000
        );
        
        smoke.rotation.z = Math.random() * 360;
        smoke.userData = {
            speed: 0.2 + Math.random() * 0.3,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            initialX: smoke.position.x
        };
        
        scene.add(smoke);
        smokeParticles.push(smoke);
    }

        const clock = new THREE.Clock();
    let delta = 0;

    // Función de animación
    function animate() {
        delta = clock.getDelta();
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Actualizar partículas
        smokeParticles.forEach((smoke, i) => {
            // Movimiento suave en el lugar
            smoke.position.x = smoke.userData.initialX + Math.sin(time * 0.1 + i) * 50;
            smoke.position.y += Math.sin(time * 0.5 + i) * 0.1;
            
            // Rotación suave
            smoke.rotation.z += smoke.userData.rotationSpeed * 0.5;
            
            // Mantener las partículas dentro de un rango
            if (smoke.position.y > 500) smoke.position.y = -500;
            if (smoke.position.x > 1000) smoke.position.x = -1000;
        });
        
        renderer.render(scene, camera);
    }

    // Manejador de redimensionamiento
    function handleResize() {
        const rect = gallery.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height);
    }

    // Iniciar animación
    animate();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    
    // Limpieza
    return () => {
        window.removeEventListener('resize', handleResize);
        if (gallery.contains(renderer.domElement)) {
            gallery.removeChild(renderer.domElement);
        }
    };
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño retraso para asegurar que la galería esté cargada
    setTimeout(initGallerySmoke, 100);
});
