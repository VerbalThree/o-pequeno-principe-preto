// Variáveis para controle de rotação
let isDragging = false;
let rotationVelocityX = 0;
let rotationVelocityY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let dampingFactor = 0.1;

let previousMouseX = 0;
let previousMouseY = 0;

const novaSecao = document.getElementById('novaSecao');

// Configuração do Raycaster para detectar cliques
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variável de tempo para controlar o efeito do vento
let windTime = 0;

// Configurar a cena
const scene = new THREE.Scene();

// Configurar a câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Configurar o renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criar um cubo básico
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.set(0, 0, 2);

// Posicionar a câmera
camera.position.z = 5;

// Função para criar um link
function createLink(position, targetSectionId, text) {
    const linkGeometry = new THREE.PlaneGeometry(6, 3);
    const linkMaterial = new THREE.MeshBasicMaterial({ 
        map: createTextTexture(text), 
        transparent: true,
        opacity: 1 
    });
    const linkMesh = new THREE.Mesh(linkGeometry, linkMaterial);
    linkMesh.position.set(position.x, position.y, position.z);
    linkMesh.userData = { targetSectionId }; 
    scene.add(linkMesh);

    linkMesh.onClick = function() {
        transitionToNewSection(targetSectionId);
    };

    return linkMesh;
}

// Criar links para diferentes seções
const link1 = createLink({ x: 0, y: 2, z: 0 }, "novaSecao1", "Introdução");
const link2 = createLink({ x: 4, y: 0.2, z: 0 }, "novaSecao2", "Desenvolvimento - Parte 1");
const link3 = createLink({ x: 3, y: -2, z: 0 }, "novaSecao3", "Desenvolvimento - Parte 2");
const link4 = createLink({ x: -2, y: -2, z: 0 }, "novaSecao4", "Clímax");
const link5 = createLink({ x: -4, y: 0.2, z: 0 }, "novaSecao5", "Conclusão");

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    
    cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, targetRotationX, dampingFactor);
    cube.rotation.y = THREE.MathUtils.lerp(cube.rotation.y, targetRotationY, dampingFactor);

    link1.lookAt(camera.position);
    link2.lookAt(camera.position);
    link3.lookAt(camera.position);
    link4.lookAt(camera.position);
    link5.lookAt(camera.position);

    applyWindEffect(link1);
    applyWindEffect(link2);
    applyWindEffect(link3);
    applyWindEffect(link4);
    applyWindEffect(link5);

    renderer.render(scene, camera);
}
animate();

// Função para aplicar efeito de vento
function applyWindEffect(linkMesh) {
    const positionAttribute = linkMesh.geometry.attributes.position;
    windTime += 0.02;

    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const wave = Math.sin(x * 5 + windTime) * 0.10; 
        positionAttribute.setZ(i, wave);
    }

    positionAttribute.needsUpdate = true;
}

// Capturar eventos de mouse 
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);

// Adicionar luzes e sombras 
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.targetSectionId) {
            clickedObject.onClick();
        }
    }
}

function onMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        targetRotationX += deltaY * 0.005; 
        targetRotationY += deltaX * 0.005;

        targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));
    }
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseDown(event) {
    isDragging = true;
}

function onMouseUp(event) {
    isDragging = false;
}

// Função para transição
function transitionToNewSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return; // Verifica se a seção existe

    const targetPosition = targetSection.getBoundingClientRect();
    
    // Ajustar a posição da câmera para a nova seção
    const targetCameraPosition = {
        x: (targetPosition.left + targetPosition.width / 2) / window.innerWidth * 2 - 1, 
        y: -(targetPosition.top + targetPosition.height / 2) / window.innerHeight * 2 + 1,
        z: camera.position.z 
    };

    // Transição suave usando gsap
    gsap.to(camera.position, {
        duration: 2,
        x: targetCameraPosition.x,
        y: targetCameraPosition.y,
        z: targetCameraPosition.z,
        onComplete: () => {
            console.log("Transição Completa");
        }
    });
}

function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 24;

    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = 'rgba(0, 0, 0, 0,)'; // Cor do fundo
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = `${fontSize}px Arial`;
    context.fillStyle = 'white'; // Cor do texto
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 10); // Ajuste a posição vertical

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
}
