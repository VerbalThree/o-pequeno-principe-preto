// Variàveis para controle de rotação
let isDragging = false;
let rotationVelocityX = 0;
let rotationVelocityY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let dampingFactor = 0.1; // Ajuste para controle de suavidade

let linkMesh;
let previousMouseX = 0;
let previousMouseY = 0;

const novaSecao = document.getElementById('novaSecao');

// Configuração do Raycaster para detectar cliques
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variàvel de tempo para controlar o efeito do vento
let windTime = 0;

// Configurar a cena
const scene = new THREE.Scene();

// Configurar a câmera (campo de visão, aspecto, limites de renderização)
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);

// Configurar o renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criar um cubo básico
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Posicona o cubo um pouco a frente dos "links"
cube.position.set(0, 0, 2); // Coloque o cubo um pouco mais para frente

// Posicionar a câmera
camera.position.z = 5;

// Criar um plano que funcionará como link
const linkGeometry = new THREE.PlaneGeometry(4, 2, 32, 32);
const loader = new THREE.TextureLoader();
loader.load('sobre-nós.png', function(texture) {
    const linkMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true , opacity: 1});
    linkMesh = new THREE.Mesh(linkGeometry, linkMaterial);
    
    // Posicionar o "link" em relação ao cubo
    linkMesh.position.set(0, 1, 0); // Acima do cubo
    cube.add(linkMesh); // Adicionar o link como filho do cubo
    
    const boxGeometry = new THREE.BoxGeometry(6,3,0.1);
    const boxMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const collisionBox = new THREE.Mesh(boxGeometry, boxMaterial);
    collisionBox.position.set(0,0,0); 
    linkMesh.add(collisionBox);

    // Capturar cliques do mouse
    window.addEventListener('click', onClick, false);
});

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    
    // Suavizar a rotação com interpolação linear (lerp)
    cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, targetRotationX, dampingFactor);
    cube.rotation.y = THREE.MathUtils.lerp(cube.rotation.y, targetRotationY, dampingFactor);

    // Fazer o "link" sempre olhar para a câmera, se estiver carregado
    if(linkMesh){
        
        // Links olhando para a câmera
        linkMesh.lookAt(camera.position);

        // Aplicar efeito de "bandeira ao vento"
        const positionAttribute = linkMesh.geometry.attributes.position;
        windTime += 0.10; // Controlar a velocidade da animação do vento

        for(let i = 0; i < positionAttribute.count; i++){
            const x = positionAttribute.getX(i); // Obter a coordenada X do vértice
            
            // Aumenta a amplitude da oscilação para torná-la mais visível
            const wave = Math.sin(x * 5 + windTime) * 0.10; // Controle da amplitude
            positionAttribute.setZ(i, wave); // Atualizar a coordenada Z
        }

        // Marcar a geometria para ser atualizada
        positionAttribute.needsUpdate = true;
    }
    
    // Adicionar rotação ao cubo
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    
    // Renderizar a cena e a câmera
    renderer.render(scene, camera);
}
animate();

// Capturar eventos de mouse para mover ou girar objetos
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);


// Adicionar luzes e sombras 
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5).normalize();
scene.add(light);


linkMesh.onClick = function() {
    transitionToNewSection(() => {
        console.log("Transição feita.");
    });
};

function onClick(event){

    // Ajustar as coodernadas do mouse para o sistema de coordenadas do Three.js
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Atualizar o raycaster com base na posição atual do mouse e da cãmera
    raycaster.setFromCamera(mouse, camera);


    // Descobrir quais objetos são clicados
    const intersects = raycaster.intersectObject(linkMesh);

    // Verificar se o "link" foi clicado
    if (intersects.length > 0){
        linkMesh.onClick();
    }
}

// Adicionar Efeitos ao Link
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('click', onClick, false);


function onMouseMove(event){
    if(isDragging){

        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        // Acumular rotação desejada
        targetRotationX += deltaY * 0.005; // Controle de Sensibilidade
        targetRotationY += deltaX * 0.005;

        // Limitar a rotação em X entre -Math.PI/2 e Math.PI/2 (aproximadamente -90 e 90 graus)
        targetRotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotationX));

        //cube.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, cube.rotation.x + deltaY * 0.005));
        // cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, cube.rotation.x + Math.sign(deltaY) * rotationSpeed, 0.1);

        // Permitir rotação livre em Y
        // cube.rotation.y += deltaX * 0.01;

    }
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseDown(event){
    isDragging = true;
   
}

function onMouseUp(event){
    isDragging = false;
}

// Função para transição
function transitionToNewSection(callback) {

    // Definir a posição alvo para a cãmera
    const targetPosition = novaSecao.getBoundingClientRect();
    
    // Ajusta a posição da câmera para a nova seção
    const targetCameraPosition = {
        x: targetPosition.left / window.innerWidth * 2 - 1, // Ajuste necessário para converter a posição
        y: - (targetPosition.top / window.innerHeight * 2 - 1), // Ajuste para a posição Y
        z: camera.position.z // Manter a mesma distância da câmera
    };

    // Transição suave usando gsap
    gsap.to(camera.position, {
        duration: 2,
        x: targetCameraPosition.x,
        y: targetCameraPosition.y,
        z: targetCameraPosition.z,
        onComplete: () => {

            console.log("Transição Completa");

            // Executar callback após a transição
            if(typeof callback === 'function'){
                callback();

            }
        }
    });
};
