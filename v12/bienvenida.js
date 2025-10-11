// Referencias a elementos del DOM en las páginas principales
const menuMessage = document.getElementById('menu-message');
const problemText = document.getElementById('problem-text');
const problemMath = document.getElementById('problem-math');
const numeratorInput = document.getElementById('numerator-input');
const denominatorInput = document.getElementById('denominator-input');
const answerInput = document.getElementById('answer-input'); // Nuevo input para sumas
const submitAnswerBtn = document.getElementById('submit-answer-btn');
const helpPopup = document.getElementById('help-popup');
const closePopupBtn = document.getElementById('close-popup-btn');
const helpTitle = document.getElementById('help-title');
const helpExplanation = document.getElementById('help-explanation');
const backgroundMusic = document.getElementById('background-music');

let currentProblem = null;

// URLs para las API de problemas
const apiProblemUrls = {
    'fracciones': 'https://n8n-spark2.onrender.com/webhook/191526ac-e83e-4bfd-b00c-1ab587e578a0',
    'sumas': 'https://n8n-spark2.onrender.com/webhook/suma-webhook' // URL simulada para sumas
};

// URL para la API de validación
const apiValidationUrl = 'https://n8n-spark2.onrender.com/webhook/8c3d5353-8b16-4bb7-9c2e-c5b880c79012';

// Función para reproducir voz
function playSparkVoice(audioFile) {
    console.log(`Reproduciendo audio: ${audioFile}`);
    const audio = new Audio(`audios/${audioFile}`);
    audio.play().catch(error => {
        console.error(`Error al intentar reproducir el audio ${audioFile}:`, error);
    });
}

// Lógica de inicio de viaje para las misiones
const startMissionJourney = () => {
    const travelScreen = document.getElementById('travel-screen');
    const gameScreen = document.getElementById('game-screen');

    if (travelScreen && gameScreen) {
        travelScreen.classList.remove('hidden');
        travelScreen.classList.add('active');
        gameScreen.classList.remove('active');
        gameScreen.classList.add('hidden');

        setTimeout(async () => {
            travelScreen.classList.remove('active');
            travelScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            gameScreen.classList.add('active');
            await loadNewProblem();
        }, 10000);
    }
}

// CÓDIGO PARA CARGAR UN NUEVO PROBLEMA
async function loadNewProblem() {
    const missionType = document.body.id === 'mision-page' && window.location.href.includes('sumas') ? 'sumas' : 'fracciones';
    const problemUrl = apiProblemUrls[missionType];

    try {
        const response = await fetch(problemUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty: 'normal' })
        });
        const data = await response.json();
        currentProblem = data;
        
        problemText.textContent = 'Misión: Resuelve la siguiente operación para avanzar.';
        problemMath.innerHTML = `<span>${currentProblem.problem}</span>`;
        
        if (missionType === 'fracciones') {
            if (numeratorInput) numeratorInput.value = '';
            if (denominatorInput) denominatorInput.value = '';
        } else {
            if (answerInput) answerInput.value = '';
        }
        
        playSparkVoice('nueva_mision.mp3');
    } catch (error) {
        console.error('Error al cargar el problema:', error);
        problemText.textContent = 'Hubo un error. Inténtalo de nuevo.';
    }
}

// CÓDIGO PARA VALIDAR LA RESPUESTA DEL USUARIO
if (submitAnswerBtn) {
    submitAnswerBtn.addEventListener('click', validateAnswer);
}

async function validateAnswer() {
    let userAnswer;
    const missionType = document.body.id === 'mision-page' && window.location.href.includes('sumas') ? 'sumas' : 'fracciones';

    if (missionType === 'fracciones') {
        userAnswer = `${numeratorInput.value}/${denominatorInput.value}`;
    } else {
        userAnswer = answerInput.value;
    }

    const problemData = {
        problem: currentProblem.problem,
        answer: currentProblem.answer,
        user_answer: userAnswer
    };

    try {
        const response = await fetch(apiValidationUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(problemData)
        });
        const data = await response.json();

        if (data.result === 'correcta') {
            alert('¡Respuesta correcta! Impulso de Velocidad activado.');
            playSparkVoice('respuesta_correcta.mp3');
            await loadNewProblem();
        } else {
            alert('Respuesta incorrecta. Inténtalo de nuevo.');
            playSparkVoice('respuesta_incorrecta.mp3');
        }
    } catch (error) {
        console.error('Error al validar la respuesta:', error);
        alert('Hubo un error de validación.');
    }
}

// Lógica al cargar la página del menú o misión
document.addEventListener('DOMContentLoaded', () => {
    const isMissionPage = document.body.id === 'mision-page';
    const isWelcomePage = document.getElementById('home-screen');
    const isMenuPage = document.getElementById('menu-screen');

    if (isWelcomePage) {
        // Lógica de bienvenida
    } else if (isMenuPage) {
        // Lógica para la página del menú
        const storedName = localStorage.getItem('userName');
        if (!storedName) {
            window.location.href = 'index.html'; // Redirige a la página de bienvenida
        } else {
            if (menuMessage) {
                menuMessage.textContent = `¡Excelente, ${storedName}! Elige tu misión.`;
            }
        }
    } else if (isMissionPage) {
        // Lógica para la página de la misión
        startMissionJourney();
    }
    
    // Reproducir música de fondo si el audio está presente
    if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
            console.error("Error al reproducir la música de fondo:", error);
        });
    }
});