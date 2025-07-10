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

// Detectar tipo de dispositivo
let deviceType = getDeviceType();

// Elementos del DOM
const marksContainer = document.querySelector(".marks");

// Función para detectar tipo de dispositivo
function getDeviceType() {
  const width = window.innerWidth;
  if (width > 1024) return 'desktop';
  if (width > 768) return 'tablet';
  return 'mobile';
}

// Función para centrar el modelo en dispositivos pequeños
function centerModel() {
  if (!model || deviceType === 'desktop') return;
  
  // Forzar posición centrada
  model.position.set(0, 0, 0);
  
  // Ajustar la cámara para que mire al modelo
  if (camera) {
    camera.lookAt(0, 0, 0);
  }
}

// Configurar Three.js
function setupThreeJS() {
  scene = new THREE.Scene();
  scene.background = null;

  container = document.querySelector(".demonia");
  
  // Configurar contenedor según tipo de dispositivo
  if (deviceType === 'tablet') {
    container.style.height = "60vh";
    container.style.width = "100%";
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "2";
  } else if (deviceType === 'mobile') {
    container.style.height = "50vh";
    container.style.width = "100%";
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "2";
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Ajustar FOV según dispositivo para mejor encuadre
  const fov = deviceType === 'desktop' ? 45 : deviceType === 'tablet' ? 50 : 55;
  camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
  
  // Posición de cámara según dispositivo - más alejada para evitar recortes
  if (deviceType === 'desktop') {
    camera.position.set(1.3, 0, 1.7);
  } else if (deviceType === 'tablet') {
    camera.position.set(0, 0, 3.0); // Más alejada
  } else { // mobile
    camera.position.set(0, 0, 3.5); // Aún más alejada
  }
  
  // Hacer que la cámara mire al centro en dispositivos pequeños
  if (deviceType !== 'desktop') {
    camera.lookAt(0, 0, 0);
  }

  // Configurar renderer
  const isLowPower = deviceType !== 'desktop';
  renderer = new THREE.WebGLRenderer({
    antialias: !isLowPower,
    alpha: true,
    powerPreference: isLowPower ? "low-power" : "high-performance"
  });
  
  // Optimizaciones para dispositivos pequeños
  if (deviceType !== 'desktop') {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
  }
  
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Luces optimizadas según dispositivo
  const ambientLightIntensity = deviceType === 'desktop' ? 0.6 : 0.8;
  const directionalLightIntensity = deviceType === 'desktop' ? 1 : 0.8;
  
  const ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, directionalLightIntensity);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
}

// Timeline principal
function createMainTimeline() {
  if (!model) return;

  // Posición inicial según dispositivo
  if (deviceType === 'desktop') {
    model.position.set(2, 0, 0);
    model.rotation.set(0, 3.5, 0);
    model.scale.set(1, 1, 1);
  } else if (deviceType === 'tablet') {
    model.position.set(0, 0, 0); // Siempre centrado
    model.rotation.set(0, 0, 0);
    model.scale.set(1.2, 1.2, 1.2); // Más grande por estar más lejos
  } else { // mobile
    model.position.set(0, 0, 0); // Siempre centrado
    model.rotation.set(0, 0, 0);
    model.scale.set(1.0, 1.0, 1.0); // Tamaño ajustado por estar más lejos
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

  // Animaciones según dispositivo
  if (deviceType === 'desktop') {
    // Animaciones completas para desktop
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
  } else if (deviceType === 'tablet') {
    // Animaciones suaves para tablet - solo rotaciones, posición fija en centro
    demoniaTimeline
      .to(model.rotation, { y: Math.PI * 0.4, duration: 15 })
      .to(model.rotation, { x: Math.PI * 0.15, duration: 15 }, "-=7")
      .to(model.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 15 }, "-=7")
      .to(model.rotation, { y: Math.PI * 0.6, x: 0, duration: 15 })
      .to(model.position, { x: 0, y: 0, z: 0, duration: 1 }); // Forzar centro
  } else { // mobile
    // Animaciones simples para móvil - solo rotaciones, posición fija en centro
    demoniaTimeline
      .to(model.rotation, { y: Math.PI * 0.3, duration: 12 })
      .to(model.rotation, { x: Math.PI * 0.1, duration: 12 }, "-=6")
      .to(model.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 12 }, "-=6")
      .to(model.rotation, { y: Math.PI * 0.5, x: 0, duration: 12 })
      .to(model.position, { x: 0, y: 0, z: 0, duration: 1 }); // Forzar centro
  }
}

// Control de marcadores
function createMarkersControl() {
  // Solo mostrar marcadores en desktop
  if (deviceType !== 'desktop') {
    if (marksContainer) {
      marksContainer.style.display = "none";
    }
    return;
  }

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
  // Solo mostrar panel de información en desktop
  if (deviceType !== 'desktop') {
    const infoPanel = document.querySelector('.info-panel');
    if (infoPanel) {
      infoPanel.style.display = "none";
    }
    return;
  }

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
  
  // Solo mostrar marker7 en desktop
  if (deviceType !== 'desktop') {
    marker7.style.display = "none";
    return;
  }
  
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
      
      // Optimización para dispositivos pequeños
      if (deviceType !== 'desktop') {
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            // Reducir calidad de materiales en dispositivos pequeños
            if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });
      }

      scene.add(model);

      // Centrar modelo inmediatamente en dispositivos pequeños
      if (deviceType !== 'desktop') {
        centerModel();
      }

      setTimeout(() => {
        createMainTimeline();
        createMarkersControl();
        createMarker7Control();
        setupInfoPanel();
        
        // Asegurar centrado tras las animaciones iniciales
        if (deviceType !== 'desktop') {
          setTimeout(centerModel, 1000);
        }
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
    if (deviceType === 'desktop') {
      marksContainer.style.opacity = "0";
      marksContainer.style.display = "none";
    } else {
      // Ocultar completamente en tablet y móvil
      marksContainer.style.display = "none";
      marksContainer.style.opacity = "0";
    }
  }
}

// Animación
function animate() {
  requestAnimationFrame(animate);
  if (renderer && scene && camera) {
    
    // Monitorear posición del modelo en dispositivos pequeños
    if (model && deviceType !== 'desktop') {
      // Si el modelo se mueve demasiado del centro, corregir
      const maxDistance = 0.5;
      if (Math.abs(model.position.x) > maxDistance || 
          Math.abs(model.position.y) > maxDistance) {
        // Suavemente volver al centro
        model.position.x = THREE.MathUtils.lerp(model.position.x, 0, 0.1);
        model.position.y = THREE.MathUtils.lerp(model.position.y, 0, 0.1);
      }
    }
    
    renderer.render(scene, camera);
  }
}

// Resize
function handleResize() {
  const newDeviceType = getDeviceType();
  
  if (deviceType !== newDeviceType) {
    location.reload();
    return;
  }

  if (container && camera && renderer) {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    
    // Ajustar cámara según dispositivo - mantener distancia adecuada
    if (deviceType === 'mobile') {
      camera.position.z = Math.max(3.2, 3.5 * (Math.min(newWidth, newHeight) / 400));
      camera.lookAt(0, 0, 0);
    } else if (deviceType === 'tablet') {
      camera.position.z = Math.max(2.8, 3.0 * (Math.min(newWidth, newHeight) / 500));
      camera.lookAt(0, 0, 0);
    }
    
    // Asegurar que el modelo se mantenga centrado tras resize
    if (model && deviceType !== 'desktop') {
      model.position.set(0, 0, 0);
    }
  }
}

// Inicialización
function init() {
  deviceType = getDeviceType();
  
  if (deviceType !== 'desktop') {
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