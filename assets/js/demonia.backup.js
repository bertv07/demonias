// Importaciones dinámicas para cargar solo lo necesario
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'

// Configuración de rendimiento
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : 1

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

// Variables para control de rendimiento
let rafId = null
let lastRenderTime = 0
const targetFPS = 60
const frameTime = 1000 / targetFPS

// Loop de animación optimizado
function animate(timestamp) {
  rafId = requestAnimationFrame(animate)
  
  // Control de FPS para móviles
  if (isMobile) {
    const delta = timestamp - lastRenderTime
    if (delta < frameTime) return
    lastRenderTime = timestamp - (delta % frameTime)
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// Debounce para el resize
let resizeTimeout
function handleResize() {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    if (!container || !camera || !renderer) return
    
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }, 250) // 250ms de debounce
}

// Limpieza de recursos
function cleanup() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
  
  if (model) {
    scene.remove(model)
    model.traverse(child => {
      if (child.isMesh) {
        child.geometry?.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose())
        } else {
          child.material?.dispose()
        }
      }
    })
  }
  
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.globalTimeline.clear()
}

// Inicialización
function init() {
  try {
    setupThreeJS()
    initMarkers()
    loadModel()
    animate()
    
    // Manejar redimensionamiento
    window.addEventListener('resize', handleResize, { passive: true })
  } catch (error) {
    console.error('Error during initialization:', error)
    showErrorMessage()
  }
// Verificar compatibilidad con WebGL
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch (e) {
    return false
  }
}

// Cargar CSS crítico
function loadCriticalCSS() {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'assets/css/critical.css'
    link.onload = resolve
    document.head.appendChild(link)
  })
}

// Cargar recursos no críticos de forma diferida
function loadNonCriticalResources() {
  // Cargar estilos no críticos
  const styles = document.createElement('link')
  styles.rel = 'stylesheet'
  styles.href = 'assets/css/non-critical.css'
  styles.media = 'print'
  styles.onload = () => { styles.media = 'all' }
  document.head.appendChild(styles)
  
  // Precargar fuentes
  const font = new FontFaceObserver('YourPrimaryFont')
  font.load().then(() => {
    document.documentElement.classList.add('font-loaded')
  })
}

// Mostrar mensaje de error
function showErrorMessage() {
  const errorEl = document.createElement('div')
  errorEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff4444;
    color: white;
    padding: 1rem;
    text-align: center;
    z-index: 10000;
  `
  errorEl.textContent = 'Lo sentimos, ha ocurrido un error al cargar la experiencia 3D.'
  document.body.appendChild(errorEl)
}

// Mostrar mensaje de compatibilidad
function showCompatibilityMessage() {
  const message = document.createElement('div')
  message.style.cssText = `
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    text-align: center;
  `
  message.innerHTML = `
    <h2>Navegador no compatible</h2>
    <p>Tu navegador no soporta WebGL, que es necesario para esta experiencia 3D.</p>
    <p>Por favor, actualiza tu navegador o usa uno más reciente como Chrome, Firefox o Edge.</p>
  `
  const container = document.querySelector('.demonia')
  if (container) {
    container.innerHTML = ''
    container.appendChild(message)
  } else {
    document.body.insertBefore(message, document.body.firstChild)
  }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  // El DOM ya está listo
  init()
}
