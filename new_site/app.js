window.onload = function () {

    const gallery = document.querySelector(".gallery");
    const previewImage = document.querySelector(".preview-img img");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("imageDescription");
    const closeModal = document.querySelector(".close");
    const mainContent = document.querySelector(".main-content");

    const imageDescriptions = [
        "Essa daqui é a imagem 1",
        "Essa daqui é a imagem 2",
        "Essa daqui é a imagem 3",
        "Essa daqui é a imagem 4",
        "Essa daqui é a imagem 5",
        "Essa daqui é a imagem 6",
        "Essa daqui é a imagem 7",
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
        img.src = "./assets/img" + ((i % 15) + 1) + ".jpg"; 
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
            transformOrigin: "50% 400px", /// 50% 400px
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

        });

        item.addEventListener("mouseout", function () {
            previewImage.src = "./assets/img1.png";

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

        setTimeout(() => {
            modal.style.display = 'none';
        },300);  

    });

    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener("click", function(event) {
        if(event.target == modal){
            modal.classList.remove("show"); // Remove a classe para ocultar
            mainContent.classList.remove("blur-background"); // Remove o blur

        
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