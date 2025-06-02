document.addEventListener('DOMContentLoaded', () => {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const container = document.querySelector('.container');
    const celebrateBtn = document.getElementById('celebrateBtn');
    const title = document.querySelector('.title');
    const cake = document.querySelector('.cake');
    const letterContainer = document.querySelector('.letter-container');
    const letter = document.querySelector('.letter');
    const birthdayMusic = document.getElementById('birthdayMusic');
    let musicStarted = false;

    // Asegurarse de que los elementos sean interactivos
    function makeInteractive(element) {
        if (element) {
            element.style.pointerEvents = 'auto';
            element.style.cursor = 'pointer';
            element.style.touchAction = 'manipulation';
            element.style.webkitTapHighlightColor = 'transparent';
        }
    }

    // Hacer interactivos todos los botones
    makeInteractive(surpriseBtn);
    makeInteractive(celebrateBtn);
    makeInteractive(letterContainer);

    // Función para manejar eventos táctiles y clics
    function handleInteraction(element, callback) {
        if (!element) return;

        // Evento de clic
        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            callback();
        });

        // Evento táctil
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.style.transform = element === surpriseBtn ? 
                'translate(-50%, -50%) scale(0.95)' : 
                'scale(0.95)';
        }, { passive: false });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.style.transform = element === surpriseBtn ? 
                'translate(-50%, -50%) scale(1)' : 
                'scale(1)';
            callback();
        }, { passive: false });
    }

    // Configurar interacciones
    handleInteraction(surpriseBtn, showSurprise);
    handleInteraction(celebrateBtn, celebrate);

    // Función para crear confeti
    function shootConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 0,
            particleCount: 50,
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Disparar desde la izquierda
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            
            // Disparar desde la derecha
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });

            // Disparar desde el centro
            confetti({
                ...defaults,
                particleCount: particleCount / 2,
                origin: { x: 0.5, y: 0.1 }
            });
        }, 250);
    }

    // Función para disparar confeti periódicamente
    function startPeriodicConfetti() {
        // Disparar confeti cada 5 segundos
        setInterval(() => {
            shootConfetti();
        }, 5000);
    }

    // Función para animar el título
    function animateTitle() {
        if (!title) return;
        
        title.style.opacity = '1';
        title.style.animation = 'none';
        title.offsetHeight; // Forzar reflow
        title.style.animation = 'bounce 1s ease-out forwards, rainbow 4s infinite';
        
        // Asegurar que el texto sea visible
        title.style.display = 'block';
        title.style.visibility = 'visible';
        title.style.color = '#fff';
        title.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
    }

    // Función para animar el pastel
    function animateCake() {
        if (!cake) return;
        
        cake.style.animation = 'none';
        cake.offsetHeight;
        cake.style.animation = 'float 4s ease-in-out infinite';
        
        const flame = document.querySelector('.flame');
        if (flame) {
            flame.style.animation = 'flicker 0.3s ease-in-out infinite alternate';
            setTimeout(() => {
                flame.style.animation = 'flicker 0.6s ease-in-out infinite alternate';
            }, 1000);
        }
    }

    // Función para mostrar la carta
    function showLetter() {
        if (!letterContainer || !letter) return;
        
        letterContainer.classList.remove('hidden');
        letterContainer.style.display = 'flex';
        
        // Asegurar que la carta sea visible
        letter.style.opacity = '1';
        letter.style.visibility = 'visible';
        
        setTimeout(() => {
            letterContainer.classList.add('reveal');
            letter.classList.add('reveal');
        }, 100);
        
        shootConfetti();
    }

    // Función para mostrar la sorpresa
    function showSurprise() {
        console.log('Botón sorpresa clickeado');
        
        // Reproducir sonido de sorpresa
        const surpriseSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
        surpriseSound.play().catch(err => console.log('Error al reproducir sonido:', err));

        // Disparar confeti inicial
        shootConfetti();
        startPeriodicConfetti();

        // Ocultar el botón sorpresa
        if (surpriseBtn) {
            surpriseBtn.style.transform = 'scale(0)';
            setTimeout(() => {
                surpriseBtn.style.display = 'none';
            }, 300);
        }

        // Mostrar el contenido
        if (container) {
            container.classList.remove('hidden');
            container.style.display = 'block';
            setTimeout(() => {
                container.classList.add('reveal');
                // Asegurar que el título sea visible
                animateTitle();
            }, 100);
        }

        // Iniciar la música
        if (!musicStarted && birthdayMusic) {
            birthdayMusic.volume = 0.5;
            birthdayMusic.play().catch(err => console.log('Error al reproducir música:', err));
            musicStarted = true;

            birthdayMusic.addEventListener('ended', showLetter);
            setTimeout(() => {
                if (letterContainer && !letterContainer.classList.contains('reveal')) {
                    showLetter();
                }
            }, 22000);
        }
    }

    // Función para celebrar
    function celebrate() {
        console.log('Botón celebrar clickeado');
        
        // Reproducir sonido de celebración
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.play().catch(err => console.log('Error al reproducir sonido:', err));

        // Efectos visuales
        shootConfetti();
        animateTitle();
        animateCake();

        // Actualizar el botón
        if (celebrateBtn) {
            celebrateBtn.textContent = '¡Que sigas celebrando! 🎂';
            celebrateBtn.style.animation = 'pulse 2s infinite';
        }
    }

    // Eventos táctiles y de clic
    surpriseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSurprise();
    });

    celebrateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        celebrate();
    });

    // Evento para cerrar la carta
    letterContainer.addEventListener('click', (e) => {
        if (e.target === letterContainer) {
            letterContainer.classList.remove('reveal');
            setTimeout(() => {
                letterContainer.classList.add('hidden');
                letterContainer.style.display = 'none';
            }, 500);
        }
    });

    // Asegurar que los eventos táctiles funcionen
    document.addEventListener('touchstart', (e) => {
        if (e.target === surpriseBtn || e.target === celebrateBtn) {
            e.preventDefault();
        }
    }, { passive: false });

    // Inicializar
    animateTitle();
}); 