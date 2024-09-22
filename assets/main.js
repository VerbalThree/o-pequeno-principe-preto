// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('assets/space.jpg');
scene.background = spaceTexture;

// Avatar

// Criação da forma de estrela
const starShape = new THREE.Shape();
const outerRadius = 1.5; // Raio externo da estrela (ajuste conforme necessário)
const innerRadius = 0.75; // Raio interno da estrela (ajuste conforme necessário)
const spikes = 5; // Número de pontas da estrela

// Desenha a estrela usando linhas conectando as pontas e os vértices internos
for (let i = 0; i < spikes * 2; i++) {
  const radius = i % 2 === 0 ? outerRadius : innerRadius;
  const angle = (i / (spikes * 2)) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  if (i === 0) {
    starShape.moveTo(x, y);
  } else {
    starShape.lineTo(x, y);
  }
}
starShape.closePath();

// Criação da geometria da estrela a partir da forma desenhada
const starGeometry = new THREE.ShapeGeometry(starShape);

// Criação do material amarelo para a estrela
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

// Criação da malha (mesh) da estrela usando a geometria e o material
const star = new THREE.Mesh(starGeometry, starMaterial);

// Adiciona a estrela à cena
scene.add(star);

//const jeffTexture = new THREE.TextureLoader().load('assets/jeff.png');

//const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));

//scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('assets/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

star.position.z = -5;
star.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  //star.rotation.y += 0.01;
  //star.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();

// Scroll Reveal 
ScrollReveal().reveal('header', { 
  duration: 3000, 
  origin: 'top', 
  distance: '50px',
  reset: true,
  delay: 250
});

ScrollReveal().reveal('blockquote', { 
  duration: 3500, 
  origin: 'bottom', 
  distance: '50px',
  reset: true,
  delay: 250
});

ScrollReveal().reveal('section', { 
  duration: 1000, 
  origin: 'bottom', 
  distance: '50px',
  reset: true,
  delay: 125
});

ScrollReveal().reveal('.creds', { 
  duration: 3700, 
  origin: 'bottom', 
  distance: '50px',
  reset: true,
  delay: 600
});

// Função para desabilitar o Scroll
function disableScroll(){
  document.body.style.overflow = 'hidden';
}

// Função para habilitar o Scroll
function enableScroll(){
  document.body.style.overflow = 'auto';
}

// Desabilitar o Scroll caso #sorry seja visível
window.addEventListener('DOMContentLoaded', (event) => {
  const sorryElement = document.getElementById('sorry');
  if(window.getComputedStyle(sorryElement).display === 'flex'){
    disableScroll();
  }
});