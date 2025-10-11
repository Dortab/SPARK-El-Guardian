document.addEventListener('DOMContentLoaded', () => {
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

    const backgroundMusicHome = document.getElementById('background-music-home');
    const backgroundMusicGame = document.getElementById('background-music-game');
    const soundCorrect = document.getElementById('sound-correct');
    const soundIncorrect = document.getElementById('sound-incorrect');

    let userName = '';
    let currentProblem = null;
    let errorCount = 0;

    // Función para cambiar de pantalla
    function switchScreen(activeScreenId) {
        for (const key in screens) {
            if (key === activeScreenId) {
                screensActive(key);
            } else {
                screensInactive(key);
            }
        }
    }

    function screensActive(screenId) {
        screensActiveBase(screens, screenId);
        if (screenId === 'home') {
            playMusic('home');
        } else if (screenId === 'game') {
            playMusic('game');
        } else {
            stopMusic();
        }
    }

    function screensActiveBase(screens, screenId) {
        screensFunc(screens, screenId, 'add', 'remove');
    }

    function screensInactive(screenId) {
        screensInactiveBase(screens, screenId);
    }

    function screensInactiveBase(screens, screenId) {
        screensFunc(screens, screenId, 'remove', 'add');
    }

    function screensFunc(screens, screenId, addOrRemoveActive, addOrRemoveHidden) {
        screensBaseFunc(screens, screenId, 'active', addOrRemoveActive);
        screensBaseFunc(screens, screenId, 'hidden', addOrRemoveHidden);
    }

    function screensBaseFunc(screens, screenId, className, addOrRemove) {
        if (addOrRemove === 'add') {
            screensFuncBase(screens, screenId, className, 'add');
        } else if (addOrRemove === 'remove') {
            screensFuncBase(screens, screenId, className, 'remove');
        }
    }

    function screensFuncBase(screens, screenId, className, addOrRemove) {
        if (screens.hasOwnProperty(screenId)) {
            screensHandleClass(screens, screenId, className, addOrRemove);
        }
    }

    function screensHandleClass(screens, screenId, className, addOrRemove) {
        if (addOrRemove === 'add') {
            screensMethod(screens, screenId, 'classList', 'add', className);
        } else if (addOrRemove === 'remove') {
            screensMethod(screens, screenId, 'classList', 'remove', className);
        }
    }

    function screensMethod(screens, screenId, property, methodName, className) {
        screensBaseMethod(screens, screenId, property, methodName, className);
    }

    function screensBaseMethod(screens, screenId, property, methodName, className) {
        screensObjCheck(screens, screenId, property, methodName, className);
    }

    function screensObjCheck(screens, screenId, property, methodName, className) {
        if (screens.hasOwnProperty(screenId)) {
            const element = screensFuncElement(screens, screenId);
            if (element && element.hasOwnProperty(property) && typeof element.classList === 'object' && element.classList !== null) {
                screensElementMethod(element, property, methodName, className);
            }
        }
    }

    function screensFuncElement(screens, screenId) {
        return screens.hasOwnProperty(screenId) ? screensFuncBaseElement(screens, screenId) : null;
    }

    function screensFuncBaseElement(screens, screenId) {
        return document.getElementById(screenId);
    }

    function screensElementMethod(element, property, methodName, className) {
        elementBaseMethod(element, property, methodName, className);
    }

    function elementBaseMethod(element, property, methodName, className) {
        if (element && element.hasOwnProperty(property) && typeof element.classList === 'object' && element.classList !== null) {
            element.classList.toggle(className, methodName === 'add');
        }
    }

    // Funciones para controlar la música
    function playMusic(screen) {
        stopMusic();
        if (screen === 'home') {
            backgroundMusicHome.play();
        } else if (screen === 'game') {
            backgroundMusicGame.play();
        }
    }

    function stopMusic() {
        backgroundMusicHome.pause();
        backgroundMusicHome.currentTime = 0;
        backgroundMusicGame.pause();
        backgroundMusicGame.currentTime = 0;
    }

    // Función para reproducir efectos de sonido
    function playSound(sound) {
        if (sound === 'correct') {
            soundCorrect.currentTime = 0;
            soundCorrect.play();
        } else if (sound === 'incorrect') {
            soundIncorrect.currentTime = 0;
            soundIncorrect.play();
        }
    }

    // Simulamos la carga de la página
    setTimeout(() => {
        switchScreen('home');
    }, 2000);

    // Evento de la página de inicio
    startMissionBtn.addEventListener('click', () => {
        userName = usernameInput.value.trim();
        if (userName) {
            menuMessage.textContent = `¡Excelente, ${userName}! La Discordia Cuántica ha infectado el Sistema de las Fracciones. Es nuestra primera y más importante misión. En este sistema, aprenderás a dominar las fracciones para restaurar el orden en la nebulosa.`;
            switchScreen('menu');
        } else {
            alert('Por favor, ingresa tu nombre.');
        }
    });

    // Evento del menú principal
    fractionsMissionBtn.addEventListener('click', async () => {
        switchScreen('game');
        await loadNewProblem();
    });

    // Evento para enviar la respuesta del problema
    submitAnswerBtn.addEventListener('click', async () => {
        const userAnswer = `${numeratorInput.value}/${denominatorInput.value}`;

        const isCorrect = await validateAnswer(currentProblem, userAnswer);

        if (isCorrect) {
            playSound('correct');
            alert('¡Respuesta correcta! Impulso de Velocidad activado.');
            errorCount = 0;
            await loadNewProblem();
        } else {
            playSound('incorrect');
            errorCount++;
            if (errorCount >= 2) {
                showHelpPopup();
            } else {
                alert('Respuesta incorrecta. SPARK te cubre. Inténtalo de nuevo.');
            }
        }
    });

    closePopupBtn.addEventListener('click', () => {
        helpPopup.classList.add('hidden');
    });

    async function loadNewProblem() {
        const difficulty = errorCount > 0 ? 'facil' : 'normal';
        const problems = [
            { problem: '3/6', answer: '1/2', explanation: 'Para simplificar 3/6, divide tanto el numerador como el denominador por su máximo común divisor, que es 3. 3 ÷ 3 = 1 y 6 ÷ 3 = 2. Por lo tanto, 3/6 simplificado es 1/2.' },
            { problem: '4/8', answer: '1/2', explanation: 'Para simplificar 4/8, divide tanto el numerador como el denominador por su máximo común divisor, que es 4. 4 ÷ 4 = 1 y 8 ÷ 4 = 2. Por lo tanto, 4/8 simplificado es 1/2.' },
            { problem: '5/10', answer: '1/2', explanation: 'Para simplificar 5/10, divide tanto el numerador como el denominador por su máximo común divisor, que es 5. 5 ÷ 5 = 1 y 10 ÷ 5 = 2. Por lo tanto, 5/10 simplificado es 1/2.' }
        ];
        currentProblem = problems.sort(() => Math.random() - 0.5)[0]; // Seleccionar un problema aleatorio

        problemMath.textContent = `Simplifica la fracción: ${currentProblem.problem}`;
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

    // Iniciar la música de fondo de la página de inicio al cargar
    playMusic('home');
});