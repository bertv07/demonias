// Importaciones básicas
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger.js"

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// Variables globales
let model
let scene, camera, renderer, container

// Elementos del DOM
const marksContainer = document.querySelector(".marks")

// Configurar Three.js
function setupThreeJS() {
  scene = new THREE.Scene()
  scene.background = null

  container = document.querySelector(".demonia")
  const width = container.clientWidth
  const height = container.clientHeight

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(1.3, 0, 1.7)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
}

// Crear timeline principal con ScrollTrigger
function createMainTimeline() {
  if (!model) return

  console.log("Creando timeline principal...")

  // Timeline principal para el modelo 3D
  const demoniaTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "-20% top",
      end: "+=3000",
      scrub: 1,
      pin: false,
      toggleActions: "play pause reverse reset",
      //markers: true, // Descomenta para debug
    },
  })

  // Secuencia de animaciones
  demoniaTimeline
    // PASO 1: Entrada desde la derecha
    .to(model.position, {
      x: 1,
      y: 0,
      z: 0,
      duration: 1,
    })

    // PASO 2: Movimiento hacia la izquierda + rotación
    .to(
      model.position,
      {
        x: 1,
        duration: 20,
      },
      "-=50",
    )
    .to(
      model.rotation,
      {
        y: 0,
        z: 0,
        duration: 20,
      },
      "+=-10",
    )
    .to(
      model.scale,
      {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 20,
      },
      "+=-10",
    )

    // PASO 3: Continuar movimiento + más rotación
    .to(
      model.position,
      {
        x: 1.5,
        y:  0,
        z: 0,
        duration: 20,
      },
      "+=10",
    )
    .to(
      model.rotation,
      {
        y: 0,
        x: 1.4,
        duration: 50,
      },
      "-=20",
    )

    // PASO 4: Posición final
    .to(
      model.rotation,
      {
        y: 0,
        x: 0,
        duration: 50,
      },
      "-=10",
    )
    .to(
      model.position,
      {
        x: 1,
        y: 0,
        z: 0,
        duration: 50,
      },
      "-=50",
    )

    .to(
      model.scale,
      {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 10,
      },
      "-=10",
    )

  console.log("Timeline creado correctamente")
}

// Control para marcadores principales
function createMarkersControl() {
  // ScrollTrigger para marcadores generales
  ScrollTrigger.create({
    trigger: "body",
    start: "-10% top",
    end: "10% top",
    //markers: true, // Descomenta para debug
    onEnter: () => {
      console.log("Mostrando marcadores (bajando)")
      marksContainer.style.display = "block"
      gsap.to(marksContainer, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    },
    onLeave: () => {
      console.log("Ocultando marcadores (bajando)")
      gsap.to(marksContainer, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          marksContainer.style.display = "none"
        },
      })
    },
    onEnterBack: () => {
      console.log("Mostrando marcadores (subiendo)")
      marksContainer.style.display = "block"
      gsap.to(marksContainer, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    },
    onLeaveBack: () => {
      console.log("Ocultando marcadores (subiendo)")
      gsap.to(marksContainer, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          marksContainer.style.display = "none"
        },
      })
    },
  })
}

// Control para el panel de información lateral
function setupInfoPanel() {
  const infoPanel = document.querySelector('.info-panel');
  const infoContent = document.querySelector('.info-content');
  const markers = document.querySelectorAll('[class^="mark-"]');
  
  // Mostrar información al hacer hover en un marcador
  markers.forEach(marker => {
    // Encontrar el contenedor de información dentro del marcador
    const markerContainer = marker.querySelector('.mark-container');
    
    if (markerContainer) {
      const title = markerContainer.querySelector('h2')?.textContent || 'Título no disponible';
      const content = markerContainer.querySelector('p')?.textContent || 'Descripción no disponible';
      
      marker.addEventListener('mouseenter', () => {
        infoContent.innerHTML = `
          <h2>${title}</h2>
          <p>${content}</p>
        `;
        infoPanel.classList.add('active');
      });

      marker.addEventListener('mouseleave', () => {
        infoPanel.classList.remove('active');
      });
    }
  });
}

// Control específico para el marcador 7
function createMarker7Control() {
  const marker7 = document.querySelector('.mark-7');
  if (!marker7) {
    console.error('No se encontró el marcador 7');
    return;
  }
  
  // Asegurarse de que el marcador 7 sea visible inicialmente
  gsap.set(marker7, { 
    opacity: 0,
    display: 'none',
    pointerEvents: 'auto',
    zIndex: 1000
  });
  
  // Hacer el botón del marcador 7 más visible
  const buttonMark7 = marker7.querySelector('.buttom-mark');
  
  // Controlar la aparición del marcador 7 con un rango de scroll
  ScrollTrigger.create({
    trigger: "body",
    start: "20% top",
    end: "30% top",
    //markers: true,
    onEnter: () => {
      console.log("Mostrando marcador 7 (bajando)");
      marker7.style.display = "block";
      gsap.to(marker7, {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      });
    },
    onLeave: () => {
      console.log("Ocultando marcador 7 (bajando)");
      gsap.to(marker7, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.in",
        onComplete: () => {
          marker7.style.display = "none";
        }
      });
    },
    onEnterBack: () => {
      console.log("Mostrando marcador 7 (subiendo)");
      marker7.style.display = "block";
      gsap.to(marker7, {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      });
    },
    onLeaveBack: () => {
      console.log("Ocultando marcador 7 (subiendo)");
      gsap.to(marker7, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.in",
        onComplete: () => {
          marker7.style.display = "none";
        }
      });
    }
  });
}

// Cargar modelo
function loadModel() {
  const loader = new GLTFLoader()

  loader.load(
    "./assets/model/demonia.glb",
    (gltf) => {
      console.log("Modelo cargado exitosamente")
      model = gltf.scene

      // Posición inicial (derecha)
      model.position.set(2, 0, 0)
      model.rotation.set(0, 3.5, 0)
      model.scale.set(1, 1, 1)

      scene.add(model)

      // Crear animaciones
      setTimeout(() => {
        createMainTimeline()
        createMarkersControl()
        createMarker7Control()
        setupInfoPanel() // Inicializar el panel de información
      }, 500)
    },
    (progress) => {
      const percent = Math.round((progress.loaded / progress.total) * 100)
      console.log("Cargando: " + percent + "%")
    },
    (error) => {
      console.error("Error al cargar modelo:", error)
    },
  )
}

// Ocultar marcadores inicialmente
function initMarkers() {
  if (marksContainer) {
    marksContainer.style.opacity = "0"
    marksContainer.style.display = "none"
  }
}

// Loop de animación
function animate() {
  requestAnimationFrame(animate)
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Resize
function handleResize() {
  if (container && camera && renderer) {
    const newWidth = container.clientWidth
    const newHeight = container.clientHeight
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  }
}

// Inicializar
function init() {
  setupThreeJS()
  initMarkers()
  loadModel()
  createMarkersControl()
  createMarker7Control()
  animate()

  window.addEventListener("resize", handleResize)
}

// Iniciar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
