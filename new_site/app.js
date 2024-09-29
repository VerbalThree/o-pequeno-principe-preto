window.onload = function () {

    const gallery = document.querySelector(".gallery");
    const previewImage = document.querySelector(".preview-img img");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("imageDescription");
    const closeModal = document.querySelector(".close");
    const mainContent = document.querySelector(".main-content");
    let hidePreviewTimeout;
    
    const imageDescriptions = [
        "Parte 1: A Chegada do Pequeno Príncipe Preto: O Pequeno Príncipe Preto chega à Terra de um asteroide distante, onde vive em harmonia com a natureza. Ao pousar, ele é imediatamente atraído pela beleza do planeta e pelas cores vibrantes ao seu redor. A curiosidade o impulsiona a explorar este novo mundo, onde encontra formas de vida diferentes das que conhecia.",
        "Parte 2: O Encontro com a Rosa: Durante suas andanças, o Pequeno Príncipe Preto encontra uma rosa desabrochando em um jardim. Essa rosa, com suas pétalas delicadas e fragrância envolvente, atrai a atenção do príncipe. Ele se lembra de sua rosa no asteroide e sente um profundo desejo de proteger e cuidar dela. No entanto, a rosa é orgulhosa e teimosa, o que provoca conflitos entre eles.",
        "Parte 3: A Amizade com o Aviador: O Pequeno Príncipe Preto conhece um aviador perdido em um deserto. O aviador, ao avistar o príncipe, se sente imediatamente atraído por sua essência inocente e sábia. Eles iniciam uma conversa profunda sobre suas vidas, sonhos e o que realmente importa. O príncipe compartilha suas experiências e lições aprendidas em sua jornada.",
        "Parte 4: A Visita ao Planeta da Solidão: O Pequeno Príncipe Preto decide visitar um planeta que é conhecido por sua solidão. Ao chegar, ele encontra criaturas que vivem em isolamento, cada uma lidando com sua própria tristeza. Ele tenta se conectar com eles, mas percebe que a solidão é uma barreira difícil de transpor. Os habitantes parecem perdidos em seus próprios mundos.",
        "Parte 5: O Encontro com o Comerciante: Em sua jornada, o Pequeno Príncipe Preto encontra um comerciante que está obcecado por dinheiro e bens materiais. O comerciante se dedica a acumular riquezas, acreditando que isso lhe trará felicidade. O príncipe, perplexo, tenta entender essa mentalidade e questiona o valor das posses em relação às relações humanas.",
        "Parte 6: O Retorno ao Lar: Após suas muitas aventuras, o Pequeno Príncipe Preto sente que é hora de voltar para casa. Ele reflete sobre as lições que aprendeu e as amizades que fez. A jornada o transformou, e ele agora carrega em seu coração a sabedoria sobre o amor, a amizade e a importância de estar presente para os outros.",
        "---- A verdadeira essência das coisas se vê com o coração. ---- -- O essencial é invisível aos olhos. ---- Cada um é único. ---- Todas as citações foram falados pelo Pequeno Pŕincipe Preto.",
    ];
    
    document.addEventListener("mousemove", function (event) {
        const x = event.clientX;
        const y = event.clientY;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const rotateX = 55 + percentY * 2;
        const rotateY = percentX * 2;
        
        gsap.to(gallery, {
            duration: 1,
            ease: "power2.out",
            rotateX: rotateX,
            rotateY: rotateY,
            overwrite: "auto",
        });
    });
    
    for(let i = 0; i < 7; i++){ // 
        const item = document.createElement("div");
        item.className = "item";
        const img = document.createElement("img");
        img.src = "new_site/assets/img" + ((i % 15) + 1) + ".jpg"; 
        item.appendChild(img);
        gallery.appendChild(item);
    }
    
    const items = document.querySelectorAll(".item");
    const numberOfItems = items.length;
    const angleIncrement = 360 / numberOfItems;
    
    items.forEach((item, index) => {
        gsap.set(item, {
            rotationY: 90, // 90
            rotationZ: index * angleIncrement - 90, // 90
            transformOrigin: "50% 400px", // 50% 400px
        });
        
        item.addEventListener("mouseover", function () {
            const imgInsideItem = item.querySelector("img");
            previewImage.src = imgInsideItem.src;
            
            gsap.to(item, {
                x: 10,
                z: 10,
                y: 10,
                ease: "power2.out",
                durtion: 0.5, //
            });
            
            // Cancelar o temporazador se houver interação novamente
            clearTimeout(hidePreviewTimeout);
            
            // Mostrar a imagem suavemente
            gsap.to(previewImage, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out"
            });
            
        });
        
        item.addEventListener("mouseout", function () {
            previewImage.src = "./assets/img1.png";
            
            // Iniciar o temporizador para esconder a imagem após 10 segundos
            hidePreviewTimeout = setTimeout(() => {
                gsap.to(previewImage, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            }, 115);
            
            gsap.to(item, {
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.out",
                durtion: 0.5, //
            });
        });
        
        // Evento de clique para abrir o modal
        item.addEventListener("click", function () {
            
            clearTimeout(hidePreviewTimeout); // Cancelar o temporizador ao abrir o modal
            
            const imgInsideItem = item.querySelector("img");
            modalImage.src = imgInsideItem.src;
            modalDescription.textContent = imageDescriptions[index]; // Descrição de cada imagem
            modal.classList.add("show"); // Adiciona a classe para mostrar
            mainContent.classList.add("blur-background"); // Adiciona o blur
            
            
        });
    });
    
    // Evento para fechar o modal
    closeModal.addEventListener("click", function() {
        modal.classList.remove("show"); // Remove a classe para ocultar
        mainContent.classList.remove("blur-background"); // Remove o blur
        
        hidePreviewTimeout = setTimeout(() => {
            gsap.to(previewImage, {
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }, 115);
        
    });
    
    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener("click", function(event) {
        if(event.target == modal){
            modal.classList.remove("show"); // Remove a classe para ocultar
            mainContent.classList.remove("blur-background"); // Remove o blur
            
            hidePreviewTimeout = setTimeout(() => {
                gsap.to(previewImage, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            }, 115);
            
        }
    });
    
    
    ScrollTrigger.create({
        
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        onRefresh: setupRotation,
        onUpdate: (self) => {
            
            const rotationProgress = self.progress * 360 * 1;
            items.forEach((item, index) => {
                
                const currentAngle = index * angleIncrement - 90 + rotationProgress;
                gsap.to(item, {
                    
                    rotationZ: currentAngle,
                    duration: 1,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });
        },
    });
};

function setupRotation() {}

// Bolinha
const follower = document.querySelector('.follower');

let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    
    targetX = event.clientX;
    targetY = event.clientY;
});

function animate() {
    
    const followerRect = follower.getBoundingClientRect();
    const x = followerRect.left + followerRect.width / 2;
    const y = followerRect.top + followerRect.height / 2;
    
    const dx = targetX - x;
    const dy = targetY - y;
    
    const smoothFactor = 0.100; // Quanto mais baixo, mais suave
    const newX = x + dx * smoothFactor;
    const newY = y + dy * smoothFactor;
    
    follower.style.left = `${newX}px`;
    follower.style.top = `${newY}px`;
    
    requestAnimationFrame(animate);
}

animate();

// Pop-up para mobile
function showPopup(popupId){
    document.getElementById('popup' + popupId).style.display = 'block';
    document.getElementById('mainContent').classList.add('blur-background');
}

function hidePopup(popupId){
    document.getElementById('popup' + popupId).style.display = 'none';
    document.getElementById('mainContent').classList.remove('blur-background');
}