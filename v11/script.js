// Referencias a elementos del DOM
const startMissionBtn = document.getElementById('start-mission-btn');
const fractionsMissionBtn = document.getElementById('fractions-mission-btn');
const usernameInput = document.getElementById('username-input');
const menuMessage = document.getElementById('menu-message');
const screens = document.querySelectorAll('.screen');

const problemText = document.getElementById('problem-text');
const problemMath = document.getElementById('problem-math');
const numeratorInput = document.getElementById('numerator-input');
const denominatorInput = document.getElementById('denominator-input');
const submitAnswerBtn = document.getElementById('submit-answer-btn');

const helpPopup = document.getElementById('help-popup');
const closePopupBtn = document.getElementById('close-popup-btn');
const helpTitle = document.getElementById('help-title');
const helpExplanation = document.getElementById('help-explanation');

let currentProblem = null;
let userName = '';

// Referencia al elemento de audio de música de fondo
const backgroundMusic = document.getElementById('background-music');

// Nueva función para reproducir voz
function playSparkVoice(audioFile) {
    console.log(`Reproduciendo audio: ${audioFile}`);
    const audio = new Audio(`audios/${audioFile}`);
    audio.play().catch(error => {
        console.error(`Error al intentar reproducir el audio ${audioFile}:`, error);
    });
}

// Cambia entre pantallas
const switchScreen = (screenId) => {
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
};

// Lógica para el botón de "Empezar Misión"
startMissionBtn.addEventListener('click', () => {
    // Reproducir la música de fondo al primer clic del usuario
    backgroundMusic.play().catch(error => {
        console.error("Error al reproducir la música de fondo:", error);
    });
    
    userName = usernameInput.value || 'Cadete';
    menuMessage.textContent = `¡Excelente, ${userName}! Elige tu misión.`;
    switchScreen('menu');
    playSparkVoice('bienvenido.mp3');
});

// Lógica para el botón de "Sistema de las Fracciones"
fractionsMissionBtn.addEventListener('click', () => {
    switchScreen('travel');
    setTimeout(async () => {
        switchScreen('game');
        await loadNewProblem();
    }, 10000); // 10 segundos de "viaje"
});

// Muestra el pop-up de ayuda
function showHelp(title, explanation) {
    helpTitle.textContent = title;
    helpExplanation.textContent = explanation;
    helpPopup.classList.remove('hidden');
}

closePopupBtn.addEventListener('click', () => {
    helpPopup.classList.add('hidden');
});

// CÓDIGO PARA CARGAR UN NUEVO PROBLEMA
async function loadNewProblem() {
    try {
        const response = await fetch('https://n8n-spark2.onrender.com/webhook/191526ac-e83e-4bfd-b00c-1ab587e578a0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty: 'normal' })
        });
        const data = await response.json();
        currentProblem = data;
        
        problemText.textContent = 'Misión: Resuelve la siguiente operación para avanzar.';
        problemMath.innerHTML = `<span>${currentProblem.problem}</span>`;
        numeratorInput.value = '';
        denominatorInput.value = '';
        
        playSparkVoice('nueva_mision.mp3');
    } catch (error) {
        console.error('Error al cargar el problema:', error);
        problemText.textContent = 'Hubo un error. Inténtalo de nuevo.';
    }
}

// CÓDIGO PARA VALIDAR LA RESPUESTA DEL USUARIO
submitAnswerBtn.addEventListener('click', validateAnswer);

async function validateAnswer() {
    const userAnswer = `${numeratorInput.value}/${denominatorInput.value}`;
    const problemData = {
        problem: currentProblem.problem,
        answer: currentProblem.answer,
        user_answer: userAnswer
    };

    try {
        const response = await fetch('https://n8n-spark2.onrender.com/webhook/8c3d5353-8b16-4bb7-9c2e-c5b880c79012', {
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

// Inicia el juego
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        switchScreen('home');
    }, 2000);
});