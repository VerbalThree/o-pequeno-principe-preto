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
cube.position.set(0, 0, 2); // ALTERADO

// Posicionar a câmera
camera.position.z = 5;

// Função para criar um link
function createLink(position, targetSectionId, text) {
    const linkGeometry = new THREE.PlaneGeometry(5, 2.5);
    const linkMaterial = new THREE.MeshBasicMaterial({
        map: createTextTexture(text),
        transparent: true,
        opacity: 1
    });
    const linkMesh = new THREE.Mesh(linkGeometry, linkMaterial);
    linkMesh.position.set(position.x, position.y, position.z);
    linkMesh.userData = { targetSectionId };
    scene.add(linkMesh);

    linkMesh.onClick = function () {
        moveCubeAndStackLinks(); // Chamar a animação do cubo e links
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

    //applyWindEffect(link1);
    //applyWindEffect(link2);
    //applyWindEffect(link3);
    //applyWindEffect(link4);
    //applyWindEffect(link5);

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
// Função para transição
function transitionToNewSection(sectionId) {

    // Ocultar todos os planos
    introductionPlane.visible = false;
    developmentPlane.visible = false;
    development2Plane.visible = false;
    climaxPlane.visible = false;
    conclusionPlane.visible = false;

    // Mover a câmera para a direita e o cubo para a esquerda
    let targetPosition = new THREE.Vector3(0.2, 0, 5); // Mova a câmera para a direita
    let targetLookAt = new THREE.Vector3(0, 0, 0); // Onde a câmera deve olhar

    // Mostrar a seção correta
    switch (sectionId) {
        case "novaSecao1":
            introductionPlane.visible = true;
            break;
        case "novaSecao2":
            developmentPlane.visible = true;
            break;
        case "novaSecao3":
            development2Plane.visible = true;
            break;
        case "novaSecao4":
            climaxPlane.visible = true;
            break;
        case "novaSecao5":
            conclusionPlane.visible = true;
            break;
    }

    moveCameraSmoothly(targetPosition, targetLookAt);
    moveCubeAndStackLinks(); // Mover o cubo e empilhar os links
    stackLinks(); // Empilhar os links após definir a visibilidade da seção
    addBackButton(); // Adicionar botão de voltar
}


function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 18;

    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = 'rgba(0, 0, 0, 0,)'; // Cor do fundo
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = `${fontSize}px Arial`;
    context.fillStyle = 'white'; // Cor do texto
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2); // Ajuste a posição vertical (ALTERADO)

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    return texture;
}

// Função para criar os planos
function createPlanes() {
    const introText = "Aqui está o texto da introdução.";
    introductionPlane = createTextPlane(introText, { x: 4, y: 0, z: 0 });
    introductionPlane.visible = false; // Inicialmente invisível

    const devText = "Texto do Desenvolvimento Parte 1.";
    developmentPlane = createTextPlane(devText, { x: 4, y: 0, z: 0 }); // Ajuste a posição conforme necessário
    developmentPlane.visible = false;

    const dev2Text = "Texto do Desenvolvimento Parte 2.";
    development2Plane = createTextPlane(dev2Text, { x: 4, y: 0, z: 0 }); // Use uma variável separada
    development2Plane.visible = false;

    const climaxText = "Texto do Clímax.";
    climaxPlane = createTextPlane(climaxText, { x: 4, y: 0, z: 0 }); 
    climaxPlane.visible = false;

    const conclusionText = "Texto da Conclusão.";
    conclusionPlane = createTextPlane(conclusionText, { x: 4, y: 0, z: 0 }); 
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
    const geometry = new THREE.PlaneGeometry(8, 4);
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
        // Voltar o cubo para a posição inicial à esquerda
        cube.position.set(-3, 0, 2); 

        // Reposicionar os links
        link1.position.set(0, 2, 0);
        link2.position.set(4, 0.2, 0);
        link3.position.set(3, -2, 0);
        link4.position.set(-2, -2, 0);
        link5.position.set(-4, 0.2, 0);

        // Ocultar todos os planos
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
    const duration = 2; // Duração da transição em segundos
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

function moveCubeAndStackLinks() {
    const targetCubePosition = new THREE.Vector3(-3, 0, 2); // Mover o cubo para a esquerda
    const duration = 0.5; // Duração da animação em segundos
    const startPosition = cube.position.clone();

    let startTime = null;

    function animateCube(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000; // Converter para segundos

        const t = Math.min(elapsed / duration, 1); // Interpolação (0 a 1)

        // Mover o cubo suavemente para a posição final
        cube.position.lerpVectors(startPosition, targetCubePosition, t);

        // Continuar a animação enquanto não tiver terminado
        if (t < 1) {
            requestAnimationFrame(animateCube);
        } else {
            stackLinks(); // Empilhar os links após o cubo terminar de se mover
        }
    }

    requestAnimationFrame(animateCube);
}

function stackLinks() {
    // Reposicionar os links em uma pilha vertical ao lado do cubo
    const linkSpacing = 0.25; // Espaçamento entre os links
    const baseX = cube.position.x + 1; // Posição base do empilhamento ao lado do cubo
    const baseY = 1; // Posição inicial de empilhamento no eixo Y

    link1.visible = true;
    link2.visible = true;
    link3.visible = true;
    link4.visible = true;
    link5.visible = true;

    link1.position.set(baseX, baseY + 2 * linkSpacing, 0);
    link2.position.set(baseX, baseY + 1 * linkSpacing, 0);
    link3.position.set(baseX, baseY, 0);
    link4.position.set(baseX, baseY - 1 * linkSpacing, 0);
    link5.position.set(baseX, baseY - 2 * linkSpacing, 0);
}