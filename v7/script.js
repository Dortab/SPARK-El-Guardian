document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        loading: document.getElementById('loading-screen'),
        home: document.getElementById('home-screen'),
        menu: document.getElementById('menu-screen'),
        game: document.getElementById('game-screen'),
        travel: document.getElementById('travel-screen')
    };

    const usernameInput = document.getElementById('username-input');
    const startMissionBtn = document.getElementById('start-mission-btn');
    const fractionsMissionBtn = document.getElementById('fractions-mission-btn');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const problemText = document.getElementById('problem-text');
    const problemMath = document.getElementById('problem-math');
    const numeratorInput = document.getElementById('numerator-input');
    const denominatorInput = document.getElementById('denominator-input');
    const helpPopup = document.getElementById('help-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const menuMessage = document.getElementById('menu-message');

    let userName = '';
    let currentProblem = null;
    let errorCount = 0;

    // Función para cambiar de pantalla
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
    }

    // Simulamos la carga de la página
    setTimeout(() => {
        switchScreen('home');
    }, 2000);

    // Evento de la página de inicio
    startMissionBtn.addEventListener('click', () => {
        userName = usernameInput.value.trim();
        if (userName) {
            const message = `¡Excelente, ${userName}! La Discordia Cuántica ha infectado el Sistema de las Fracciones.<br>Es nuestra primera y más importante misión.<br>En este sistema, aprenderás a dominar las fracciones para restaurar el orden en la nebulosa.`;
            menuMessage.innerHTML = message;
            switchScreen('menu');
        } else {
            alert('Por favor, ingresa tu nombre.');
        }
    });

    // Evento del menú principal
    fractionsMissionBtn.addEventListener('click', async () => {
        switchScreen('travel');
        setTimeout(async () => {
            switchScreen('game');
            await loadNewProblem();
        }, 10000); // 10 segundos de "viaje"
    });

    // Evento para enviar la respuesta del problema
    submitAnswerBtn.addEventListener('click', async () => {
        const userAnswer = `${numeratorInput.value}/${denominatorInput.value}`;

        // Simulación de llamada a la API de IA
        const isCorrect = await validateAnswer(currentProblem, userAnswer);

        if (isCorrect) {
            alert('¡Respuesta correcta! Impulso de Velocidad activado.');
            errorCount = 0; // Reiniciar contador de errores
            await loadNewProblem();
        } else {
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
        // Opcionalmente, recargar el mismo tipo de problema para reforzar
    });

    // Función simulada para cargar un nuevo problema
    async function loadNewProblem() {
        const difficulty = errorCount > 0 ? 'facil' : 'normal';
        // En un entorno real, aquí se haría una llamada a la API de IA o a n8n
        // const response = await fetch('/api/generate_problem', { method: 'POST', body: JSON.stringify({ difficulty }) });
        // const data = await response.json();
        
        // Datos simulados
        const problems = [
            { problem: '3/6', answer: '1/2' },
            { problem: '4/8', answer: '1/2' },
            { problem: '5/10', answer: '1/2' }
        ];
        currentProblem = problems[Math.floor(Math.random() * problems.length)];
        
        problemText.textContent = 'Misión: Resuelve la siguiente operación para avanzar.';
        problemMath.textContent = `Simplifica la fracción: ${currentProblem.problem}`;
        numeratorInput.value = '';
        denominatorInput.value = '';
    }

    // Función simulada para validar la respuesta
    async function validateAnswer(problem, userAnswer) {
        // En un entorno real, se haría una llamada a la API de GPT-4 o a n8n
        // const response = await fetch('/api/validate_answer', { method: 'POST', body: JSON.stringify({ problem, userAnswer }) });
        // const data = await response.json();
        // return data.isCorrect;
        
        // Lógica de validación simulada
        return userAnswer === problem.answer;
    }

    // Función para mostrar el pop-up de ayuda
    function showHelpPopup() {
        document.getElementById('help-title').textContent = "¡Cadete, alto el fuego!";
        document.getElementById('help-explanation').textContent = "Parece que la Discordia Cuántica está intentando confundirte. No te preocupes, yo te cubro. La clave para simplificar fracciones es encontrar un número que divida tanto al numerador como al denominador.";
        document.getElementById('youtube-link').href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Enlace real a un video de refuerzo
        helpPopup.classList.remove('hidden');
    }
});