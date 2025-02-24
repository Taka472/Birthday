const images = [
    "images/cake.png",
    "images/heart.png"
];

const prizeImages = [
    "images/dress.png",
    "images/blindbox.png",
    "images/makeup.png",
    "images/hadilao.png",
    "images/question-sign.png",
    "images/gold-question.png"
];

const giftImage = "images/gift-box.png";

const popSound = "audio/pop.m4a";

let audioEnabled = false;

function scatterImage() {
    const totalImages = 35;
    const container = document.getElementById('background-images');
    const bodyWidth = window.innerWidth;
    const bodyHeight = window.innerHeight;
    

    for (let i = 0; i < totalImages; i++) {
        const img = document.createElement("img");
        img.src = images[Math.floor(Math.random() * images.length)];
        img.className = "scattered-images";

        const randomX = Math.random() * bodyWidth;
        const randomY = Math.random() * bodyHeight;
        const randomSize = 20 + Math.random() * 80;
        const randomRotation = Math.random() * 360;

        img.style.position = 'absolute'
        img.style.width = `${randomSize}px`;
        img.style.height = `${randomSize}px`;
        img.style.left = `${randomX}px`;
        img.style.top = `${randomY}px`;
        img.style.transform = `rotate(${randomRotation}deg)`;
        img.style.opacity = 0.3;

        container.appendChild(img);
    }
}

function loadPrizes() {
    const container = document.getElementById("prize-container");

    prizeImages.forEach((imagePath, index) => {
        const img = document.createElement("img");
        img.src = imagePath;
        img.className = "prize-image hidden";

        container.appendChild(img);

        let delay = index * 500;
        
        if (index === prizeImages.length - 1) {
            delay += 1500;
        }

        setTimeout(() => {
            img.classList.remove("hidden");
            img.classList.add("popup");

            if (audioEnabled) {
                const audio = new Audio(popSound);
                audio.play().catch((err) =>
                    console.error("Audio playback failed:", err)
                );
            }

            if (index === prizeImages.length - 1) {
                setTimeout(loadGiftGrid, 1000);
            }
        }, delay);
    });
}

function enableAudioOnInteraction() {
    document.addEventListener("click", () => {
        audioEnabled = true;
        document.removeEventListener("click", enableAudioOnInteraction);
    });
}

function loadGiftGrid() {
    const giftContainer = document.getElementById('gift-container');

    for (let i = 0; i < 6; i++) {
        const wrapper = document.createElement('div');

        const img = document.createElement('img');
        img.src = giftImage;
        img.alt = "Gift";
        wrapper.id = i;
        wrapper.className = "wrapper";
        img.className = "gift-image hidden";

        wrapper.appendChild(img);
        giftContainer.appendChild(wrapper);

        const delay = i * 200;

        setTimeout(() => {
            img.classList.remove('hidden'); 
            img.classList.add('popup');
        }, delay);
    }

    enableGiftSelection();
}

function shuffleGifts() {
    const giftContainer = document.getElementById("gift-container");
    const gifts = Array.from(giftContainer.children);

    gifts.forEach((gift) => {
        gift.classList.add("shuffle-animation");
    });

    const shuffledGifts = gifts.sort(() => Math.random() - 0.5);

    setTimeout(() => {
        gifts.forEach((gift) => gift.classList.remove("shuffle-animation"));
        giftContainer.innerHTML = "";
        shuffledGifts.forEach((gift) => giftContainer.appendChild(gift));
    }, 1000);
}

function enableGiftSelection() {
    const giftContainer = document.getElementById("gift-container"); 
    const giftWrappers = document.querySelectorAll("#gift-container .wrapper");
    const shuffleButton = document.getElementById("shuffle");

    giftWrappers.forEach((wrapper) => {
        wrapper.addEventListener("click", function handleSelection() {
            const giftImage = wrapper.querySelector("img");

            giftImage.style.transform = "scale(2)";
            giftImage.style.transition = "transform 2s ease";

            giftWrappers.forEach((otherWrapper) => {
                if (otherWrapper.id !== wrapper.id) {
                    //otherWrapper.classList.add('fade-out');
                    otherWrapper.remove();
                }
            })

            giftContainer.style.display = "flex";
            giftContainer.style.justifyContent = "center";
            giftContainer.style.alignItems = "center";

            shuffleButton.remove();

            wrapper.removeEventListener("click", handleSelection);
        });

        wrapper.addEventListener("click", function revealGift() {
            const giftImgElement = wrapper.querySelector("img");
            giftImgElement.classList.add("fade-out");

            setTimeout(() => {
                giftImgElement.src = getGiftByID(wrapper.id); // Change to the new image
                giftImgElement.classList.remove("fade-out");
                giftImgElement.classList.add("popup");

                const congratsMessage = document.createElement("div");
                congratsMessage.textContent = "🎉 Chúc mừng! Hoàng hậu đã trúng được " + getMessage(wrapper.id) + "🎁";
                congratsMessage.classList.add("congrats-message");

                // Insert above the gift image
                giftContainer.insertBefore(congratsMessage, wrapper);

                // Animate the message
                setTimeout(() => {
                    congratsMessage.classList.add("show");
                }, 200);
            }, 1000); // Delay for fade effect

            wrapper.removeEventListener("click", revealGift); // Remove event to prevent multiple clicks
        }, { once: true });
    });
}

function getGiftByID(id) {
    if (id == 4) {
        return 'images/combo1.png';
    }

    if (id == 5) {
        return "images/combo2.png";
    }
    return prizeImages[id] || "images/default-prize.png"; // Default image if ID is out of range
}

function getMessage(id) {
    const message = [
        "một cái váy",
        "baby three",
        "mỹ phẩm",
        "chuyến ăn Hadilao",
        "secret số 1",
        "secret số 2"
    ]

    return message[id];
}

scatterImage();
// enableAudioOnInteraction();
// loadPrizes();