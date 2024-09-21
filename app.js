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

let introductionPlane, developmentPlane, development2Plane, climaxPlane, conclusionPlane; // Variáveis globais para os planos

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
    // Ocultar todos os planos
    introductionPlane.visible = false;
    developmentPlane.visible = false;
    development2Plane.visible = false;
    climaxPlane.visible = false;
    conclusionPlane.visible = false;

    // Mostrar a seção correta e mover a câmera suavemente
    let targetPosition, targetLookAt;

    if (sectionId === "novaSecao1") {
        introductionPlane.visible = true;
        targetPosition = new THREE.Vector3(0, 0, 5);
        targetLookAt = introductionPlane.position;
    } else if (sectionId === "novaSecao2") {
        developmentPlane.visible = true;
        targetPosition = new THREE.Vector3(0, -4, 5);
        targetLookAt = developmentPlane.position;
    } else if (sectionId === "novaSecao3") {
        development2Plane.visible = true;
        targetPosition = new THREE.Vector3(0, -8, 5);
        targetLookAt = development2Plane.position;
    } else if (sectionId === "novaSecao4") {
        climaxPlane.visible = true;
        targetPosition = new THREE.Vector3(0, -12, 5);
        targetLookAt = climaxPlane.position;
    } else if (sectionId === "novaSecao5") {
        conclusionPlane.visible = true;
        targetPosition = new THREE.Vector3(0, -16, 5);
        targetLookAt = conclusionPlane.position;
    }

    moveCameraSmoothly(targetPosition, targetLookAt);
    addBackButton();
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

// Função para criar os planos
function createPlanes() {
    const introText = "Aqui está o texto da introdução.";
    introductionPlane = createTextPlane(introText, { x: 0, y: 5, z: 0 });
    introductionPlane.visible = false; // Inicialmente invisível

    const devText = "Texto do Desenvolvimento Parte 1.";
    developmentPlane = createTextPlane(devText, { x: 0, y: -2, z: 0 }); // Ajuste a posição conforme necessário
    developmentPlane.visible = false;

    const dev2Text = "Texto do Desenvolvimento Parte 2.";
    development2Plane = createTextPlane(dev2Text, { x: 0, y: -9, z: 0 }); // Use uma variável separada
    development2Plane.visible = false;

    const climaxText = "Texto do Clímax.";
    climaxPlane = createTextPlane(climaxText, { x: 0, y: -16, z: 0 }); 
    climaxPlane.visible = false;

    const conclusionText = "Texto da Conclusão.";
    conclusionPlane = createTextPlane(conclusionText, { x: 0, y: -23, z: 0 }); 
    conclusionPlane.visible = false;

    // Adicionar planos à cena
    scene.add(introductionPlane);
    scene.add(developmentPlane);
    scene.add(development2Plane);
    scene.add(climaxPlane);
    scene.add(conclusionPlane);
}

// Função para criar um plano de texto
function createTextPlane(text, position) {
    const geometry = new THREE.PlaneGeometry(6, 3);
    const material = new THREE.MeshBasicMaterial({ 
        map: createTextTexture(text), 
        transparent: true,
        opacity: 1 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    return mesh;
}

// Função para adicionar um botão de voltar
function addBackButton() {
    const backButton = document.createElement('button');
    backButton.innerText = "Voltar";
    backButton.style.position = 'absolute';
    backButton.style.top = '10px';
    backButton.style.left = '10px';
    backButton.onclick = () => {
        // Esconder todos os planos e mostrar os links novamente
        introductionPlane.visible = false;
        developmentPlane.visible = false;
        climaxPlane.visible = false;
        conclusionPlane.visible = false;
        camera.position.set(0, 0, 5); // Voltar a posição inicial da câmera

        // Remover botão
        backButton.remove();
    };
    document.body.appendChild(backButton);
}


// Chame esta função para criar os planos na inicialização
createPlanes();

// Função para transição suave da câmera
function moveCameraSmoothly(targetPosition, targetLookAt) {
    const duration = 1; // Duração da transição em segundos
    const startPosition = camera.position.clone();
    const startLookAt = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));

    let startTime = null;

    function animateCamera(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000; // Converter para segundos

        const t = Math.min(elapsed / duration, 1); // Interpolação (0 a 1)

        // Interpolação da posição da câmera
        camera.position.lerpVectors(startPosition, targetPosition, t);

        // Interpolação do olhar da câmera
        const lookAtPosition = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, t);
        camera.lookAt(lookAtPosition);

        // Continuar a animação enquanto não tiver terminado
        if (t < 1) {
            requestAnimationFrame(animateCamera);
        }
    }

    requestAnimationFrame(animateCamera);
}