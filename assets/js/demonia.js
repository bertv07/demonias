// Importaciones básicas
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Variables globales
let model;
let scene, camera, renderer, container;
let isMobile = window.innerWidth <= 1024;

// Elementos del DOM
const marksContainer = document.querySelector(".marks");

// Configurar Three.js
function setupThreeJS() {
  scene = new THREE.Scene();
  scene.background = null;

  container = document.querySelector(".demonia");
  
  // Asegurar tamaño en móvil
  if (isMobile) {
    container.style.height = "50vh";
    container.style.width = "100%";
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "0";
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  
  // Posición de cámara diferente para móvil
  if (isMobile) {
    camera.position.set(0, 0, 2.5);
  } else {
    camera.position.set(1.3, 0, 1.7);
  }

  renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: isMobile ? "low-power" : "high-performance"
  });
  
  // Optimizaciones para móvil
  if (isMobile) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
  }
  
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Luces optimizadas
  const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.8 : 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, isMobile ? 0.8 : 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
}

// Timeline principal
function createMainTimeline() {
  if (!model) return;

  // Posición inicial según dispositivo
  if (isMobile) {
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(0.8, 0.8, 0.8);
  } else {
    model.position.set(2, 0, 0);
    model.rotation.set(0, 3.5, 0);
    model.scale.set(1, 1, 1);
  }

  const demoniaTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "-20% top",
      end: "+=3000",
      scrub: 1,
      pin: false,
      toggleActions: "play pause reverse reset",
    },
  });

  // Animaciones adaptadas
  if (isMobile) {
    demoniaTimeline
      .to(model.rotation, { y: Math.PI * 0.5, duration: 10 })
      .to(model.rotation, { x: Math.PI * 0.25, duration: 10 }, "-=5")
      .to(model.scale, { x: 1, y: 1, z: 1, duration: 10 }, "-=5")
      .to(model.rotation, { y: Math.PI, x: 0, duration: 10 });
  } else {
    demoniaTimeline
      .to(model.position, { x: 1, y: 0, z: 0, duration: 1 })
      .to(model.position, { x: 1, duration: 20 }, "-=50")
      .to(model.rotation, { y: 0, z: 0, duration: 20 }, "+=-10")
      .to(model.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 20 }, "+=-10")
      .to(model.position, { x: 1.5, y: 0, z: 0, duration: 20 }, "+=10")
      .to(model.rotation, { y: 0, x: 1.4, duration: 50 }, "-=20")
      .to(model.rotation, { y: 0, x: 0, duration: 50 }, "-=10")
      .to(model.position, { x: 1, y: 0, z: 0, duration: 50 }, "-=50")
      .to(model.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 10 }, "-=10");
  }
}

// Control de marcadores
function createMarkersControl() {
  ScrollTrigger.create({
    trigger: "body",
    start: "-10% top",
    end: "10% top",
    onEnter: () => {
      marksContainer.style.display = "block";
      gsap.to(marksContainer, { opacity: 1, duration: 0.3 });
    },
    onLeave: () => {
      gsap.to(marksContainer, { 
        opacity: 0, 
        duration: 0.3,
        onComplete: () => marksContainer.style.display = "none"
      });
    },
    onEnterBack: () => {
      marksContainer.style.display = "block";
      gsap.to(marksContainer, { opacity: 1, duration: 0.3 });
    },
    onLeaveBack: () => {
      gsap.to(marksContainer, { 
        opacity: 0, 
        duration: 0.3,
        onComplete: () => marksContainer.style.display = "none"
      });
    },
  });
}

// Panel de información
function setupInfoPanel() {
  const infoPanel = document.querySelector('.info-panel');
  const infoContent = document.querySelector('.info-content');
  const markers = document.querySelectorAll('[class^="mark-"]');
  
  markers.forEach(marker => {
    const markerContainer = marker.querySelector('.mark-container');
    if (markerContainer) {
      const title = markerContainer.querySelector('h2')?.textContent || '';
      const content = markerContainer.querySelector('p')?.textContent || '';
      
      marker.addEventListener('mouseenter', () => {
        infoContent.innerHTML = `<h2>${title}</h2><p>${content}</p>`;
        infoPanel.classList.add('active');
      });

      marker.addEventListener('mouseleave', () => {
        infoPanel.classList.remove('active');
      });
    }
  });
}

// Marcador 7
function createMarker7Control() {
  const marker7 = document.querySelector('.mark-7');
  if (!marker7) return;
  
  gsap.set(marker7, { opacity: 0, display: 'none' });
  
  ScrollTrigger.create({
    trigger: "body",
    start: "20% top",
    end: "30% top",
    onEnter: () => {
      marker7.style.display = "block";
      gsap.to(marker7, { opacity: 1, duration: 1 });
    },
    onLeave: () => {
      gsap.to(marker7, { 
        opacity: 0, 
        duration: 0.7,
        onComplete: () => marker7.style.display = "none"
      });
    },
    onEnterBack: () => {
      marker7.style.display = "block";
      gsap.to(marker7, { opacity: 1, duration: 1 });
    },
    onLeaveBack: () => {
      gsap.to(marker7, { 
        opacity: 0, 
        duration: 0.7,
        onComplete: () => marker7.style.display = "none"
      });
    }
  });
}

// Cargar modelo
function loadModel() {
  const loader = new GLTFLoader();

  loader.load(
    "./assets/model/demonia.glb",
    (gltf) => {
      model = gltf.scene;
      
      // Optimización para móvil
      if (isMobile) {
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });
      }

      scene.add(model);

      setTimeout(() => {
        createMainTimeline();
        createMarkersControl();
        createMarker7Control();
        setupInfoPanel();
      }, 500);
    },
    (progress) => {
      console.log("Cargando: " + Math.round((progress.loaded / progress.total) * 100) + "%");
    },
    (error) => {
      console.error("Error al cargar modelo:", error);
    }
  );
}

// Inicializar marcadores
function initMarkers() {
  if (marksContainer) {
    marksContainer.style.opacity = "0";
    marksContainer.style.display = "none";
  }
}

// Animación
function animate() {
  requestAnimationFrame(animate);
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// Resize
function handleResize() {
  const newIsMobile = window.innerWidth <= 1024;
  
  if (isMobile !== newIsMobile) {
    location.reload();
    return;
  }

  if (container && camera && renderer) {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    
    if (isMobile) {
      camera.position.z = 2.5 * (Math.min(newWidth, newHeight) / 500);
    }
  }
}

// Inicialización
function init() {
  isMobile = window.innerWidth <= 1024;
  
  if (isMobile) {
    THREE.Cache.enabled = true;
  }
  
  setupThreeJS();
  initMarkers();
  loadModel();
  animate();

  window.addEventListener("resize", handleResize);
}

// Iniciar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}