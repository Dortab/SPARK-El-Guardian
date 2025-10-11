document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const screens = {
        loading: document.getElementById('loading-screen'),
        home: document.getElementById('home-screen'),
        menu: document.getElementById('menu-screen'),
        game: document.getElementById('game-screen')
    };

    const usernameInput = document.getElementById('username-input');
    const startMissionBtn = document.getElementById('start-mission-btn');
    const fractionsMissionBtn = document.getElementById('fractions-mission-btn');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const problemMath = document.getElementById('problem-math');
    const numeratorInput = document.getElementById('numerator-input');
    const denominatorInput = document.getElementById('denominator-input');
    const helpPopup = document.getElementById('help-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const menuMessage = document.getElementById('menu-message');
    const helpTitle = document.getElementById('help-title');
    const helpExplanation = document.getElementById('help-explanation');
    const youtubeLink = document.getElementById('youtube-link');

    // 2. Elementos de Audio
    const backgroundMusicHome = document.getElementById('background-music-home');
    const backgroundMusicGame = document.getElementById('background-music-game');
    const soundCorrect = document.getElementById('sound-correct');
    const soundIncorrect = document.getElementById('sound-incorrect');

    // 3. Variables de Estado
    let userName = '';
    let currentProblem = null;
    let errorCount = 0;
    let audioPlayed = false;

    // 4. Funciones de Lógica
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    function switchScreen(activeScreenId) {
        for (const key in screens) {
            if (key === activeScreenId) {
                screens[key].classList.add('active');
                screens[key].classList.remove('hidden');
            } else {
                screens[key].classList.remove('active');
                screens[key].classList.add('hidden');
            }
        }
        updateAudio(activeScreenId);
    }

    function updateAudio(screenId) {
        stopMusic();
        if (screenId === 'home' || screenId === 'menu') {
            playMusic(backgroundMusicHome);
        } else if (screenId === 'game') {
            playMusic(backgroundMusicGame);
        }
    }

    function playMusic(audioElement) {
        if (!audioPlayed) {
            // El primer clic del usuario en la página permite la reproducción
            document.body.addEventListener('click', () => {
                audioElement.play().catch(e => console.error("Error al reproducir audio:", e));
            }, { once: true });
        } else {
            audioElement.play().catch(e => console.error("Error al reproducir audio:", e));
        }
    }

    function stopMusic() {
        backgroundMusicHome.pause();
        backgroundMusicHome.currentTime = 0;
        backgroundMusicGame.pause();
        backgroundMusicGame.currentTime = 0;
    }

    function playSound(soundElement) {
        soundElement.currentTime = 0;
        soundElement.play();
    }

    async function loadNewProblem() {
        const difficulty = errorCount > 0 ? 'facil' : 'normal';
        // Simulación de datos
        const problems = [
            { problem: '3/6', answer: '1/2', explanation: 'Para simplificar 3/6, divide el numerador y el denominador por 3. Obtienes 1/2.' },
            { problem: '4/8', answer: '1/2', explanation: 'Para simplificar 4/8, divide el numerador y el denominador por 4. El resultado es 1/2.' },
            { problem: '5/10', answer: '1/2', explanation: 'Para simplificar 5/10, divide el numerador y el denominador por 5. La fracción simplificada es 1/2.' }
        ];
        currentProblem = problems[Math.floor(Math.random() * problems.length)];
        
        problemMath.textContent = currentProblem.problem;
        numeratorInput.value = '';
        denominatorInput.value = '';
    }

    async function validateAnswer(problem, userAnswer) {
        return userAnswer === problem.answer;
    }

    function showHelpPopup() {
        helpTitle.textContent = "¡Cadete, espera!";
        helpExplanation.textContent = currentProblem.explanation || "SPARK está aquí para ayudarte. Recuerda los conceptos básicos de las fracciones.";
        youtubeLink.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Reemplazar con un enlace relevante
        helpPopup.classList.remove('hidden');
    }

    // 5. Event Listeners (Manejadores de Eventos)
    setTimeout(() => {
        switchScreen('home');
        lazyLoadImages(); // Cargar imágenes una vez que la pantalla está lista
    }, 2000);

    startMissionBtn.addEventListener('click', () => {
        userName = usernameInput.value.trim();
        if (userName) {
            menuMessage.textContent = `¡Excelente, ${userName}! La Discordia Cuántica ha infectado el Sistema de las Fracciones. Es nuestra primera y más importante misión. En este sistema, aprenderás a dominar las fracciones para restaurar el orden en la nebulosa.`;
            switchScreen('menu');
        } else {
            alert('Por favor, ingresa tu nombre.');
        }
    });

    fractionsMissionBtn.addEventListener('click', async () => {
        switchScreen('game');
        await loadNewProblem();
    });

    submitAnswerBtn.addEventListener('click', async () => {
        const userAnswer = `${numeratorInput.value}/${denominatorInput.value}`;
        const isCorrect = await validateAnswer(currentProblem, userAnswer);

        if (isCorrect) {
            playSound(soundCorrect);
            errorCount = 0;
            await loadNewProblem();
        } else {
            playSound(soundIncorrect);
            errorCount++;
            if (errorCount >= 2) {
                showHelpPopup();
            } else {
                // Mensaje simple de error
            }
        }
    });

    closePopupBtn.addEventListener('click', () => {
        helpPopup.classList.add('hidden');
    });

});