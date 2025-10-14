// Referencias a elementos del DOM
const menuMessage = document.getElementById('menu-message');
const problemText = document.getElementById('problem-text');
const problemMath = document.getElementById('problem-math');
const numeratorInput = document.getElementById('numerator-input');
const denominatorInput = document.getElementById('denominator-input');
const answerInput = document.getElementById('answer-input'); 
const submitAnswerBtn = document.getElementById('submit-answer-btn');
const backgroundMusic = document.getElementById('background-music');

// Referencias a elementos del popup de alerta
const sparkAlertContainer = document.getElementById('spark-alert-container');
const sparkAlertContent = sparkAlertContainer ? sparkAlertContainer.querySelector('.spark-alert-content') : null;
const sparkAlertTitle = document.getElementById('spark-alert-title');
const sparkAlertMessage = document.getElementById('spark-alert-message');
const sparkAlertCloseBtn = document.getElementById('spark-alert-close-btn');
const sparkAlertIcon = sparkAlertContainer ? sparkAlertContainer.querySelector('.spark-alert-icon') : null;

let currentProblem = null;

// URLs para las API de problemas
const apiProblemUrls = {
    'mision-fracciones-page': 'https://n8n-spark2.onrender.com/webhook/191526ac-e83e-4bfd-b00c-1ab587e578a0',
    'mision-sumas-page': 'https://n8n-spark2.onrender.com/webhook/ca413ffa-4bbd-4930-ac3c-c10ba851b674',
    'mision-restas-page': 'https://n8n-spark2.onrender.com/webhook/df98ee16-c19c-43b1-b57e-4ccfe736c9d1',
    'mision-multiplicaciones-page': 'https://n8n-spark2.onrender.com/webhook/c443a9d8-7cc4-457b-9cca-4d9e6bb47dda',
    'mision-divisiones-page': 'https://n8n-spark2.onrender.com/webhook/9f503e35-5bdb-4997-99d4-fa1807b13536'
};

// URLs para las API de validación
const apiValidationUrls = {
    'mision-fracciones-page': 'https://n8n-spark2.onrender.com/webhook/8c3d5353-8b16-4bb7-9c2e-c5b880c79012',
    'mision-sumas-page': 'https://n8n-spark2.onrender.com/webhook/8715dc61-d389-4bfc-89c4-14a16eeaa4b9',
    'mision-restas-page': 'https://n8n-spark2.onrender.com/webhook/8dc03731-171d-4814-915f-b88644e427ad',
    'mision-multiplicaciones-page': 'https://n8n-spark2.onrender.com/webhook/d8c1c386-a29a-4ad7-8754-f1e2771c9e01',
    'mision-divisiones-page': 'https://n8n-spark2.onrender.com/webhook/be06672c-bbc0-4180-b456-3fb7f9018232'
};


// Lógica de inicio de viaje para las misiones
const startMissionJourney = () => {
    const travelScreen = document.getElementById('travel-screen');
    const gameScreen = document.getElementById('game-screen');

    if (travelScreen && gameScreen) {
        setTimeout(async () => {
            travelScreen.classList.remove('active');
            travelScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            gameScreen.classList.add('active');
            await loadNewProblem();
        }, 10000); 
    }
}

// CÓDIGO MEJORADO PARA CARGAR UN NUEVO PROBLEMA (ALTERNANDO)
async function loadNewProblem() {
    // --- Lógica para alternar el tipo de problema ---
    let problemCounter = parseInt(sessionStorage.getItem('problemCounter') || '0');
    const problemType = problemCounter % 2 === 0 ? 'numeric' : 'word'; // Si es par, numérico; si es impar, de palabras.
    problemCounter++;
    sessionStorage.setItem('problemCounter', problemCounter.toString());
    // --- Fin de la lógica de alternancia ---

    const missionType = document.body.id;
    const problemUrl = apiProblemUrls[missionType];

    try {
        const response = await fetch(problemUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                difficulty: 'easy',
                problem_type: problemType // Enviamos el tipo de problema
            })
        });
        const data = await response.json();
        currentProblem = data;
        
        problemText.textContent = 'Misión: Resuelve el siguiente desafío para avanzar.';
        problemMath.innerHTML = `<span>${currentProblem.problem}</span>`;
        
        if (missionType === 'mision-fracciones-page') {
            if (numeratorInput) numeratorInput.value = '';
            if (denominatorInput) denominatorInput.value = '';
        } else {
            if (answerInput) answerInput.value = '';
        }
        
    } catch (error) {
        console.error('Error al cargar el problema:', error);
        problemText.textContent = 'Hubo un error al cargar el problema. Inténtalo de nuevo.';
    } finally {
        if (submitAnswerBtn) {
            submitAnswerBtn.disabled = false;
            submitAnswerBtn.textContent = 'Resolver';
        }
    }
}

// CÓDIGO PARA VALIDAR LA RESPUESTA
async function validateAnswer() {
    if (submitAnswerBtn) {
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.textContent = 'Validando...';
    }

    const missionType = document.body.id;
    let userAnswer;

    if (missionType === 'mision-fracciones-page') {
        userAnswer = `${numeratorInput.value}/${denominatorInput.value}`;
    } else {
        userAnswer = answerInput.value;
    }

    const problemData = {
        problem: currentProblem.problem,
        answer: currentProblem.answer,
        user_answer: userAnswer
    };
    
    const validationUrl = apiValidationUrls[missionType];

    try {
        const response = await fetch(validationUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(problemData)
        });
        const data = await response.json();

        if (data.result === 'correcta') {
            showSparkAlert('¡Respuesta Correcta!', '¡Bien hecho, cadete!', 'correct', loadNewProblem);
        } else {
            const explanation = currentProblem.explanation || '¡No te rindas! Revisa tus cálculos e inténtalo de nuevo.';
            showSparkAlert('Respuesta Incorrecta', explanation, 'incorrect');
            if (submitAnswerBtn) {
                submitAnswerBtn.disabled = false;
                submitAnswerBtn.textContent = 'Resolver';
            }
        }
    } catch (error) {
        console.error('Error al validar la respuesta:', error);
        showSparkAlert('Error de Conexión', 'Hubo un error al validar. Revisa tu conexión.', 'incorrect');
        if (submitAnswerBtn) {
            submitAnswerBtn.disabled = false;
            submitAnswerBtn.textContent = 'Resolver';
        }
    }
}

// Lógica para mostrar la alerta personalizada
let alertCallback = null;
function showSparkAlert(title, message, type, callback = null) {
    if (!sparkAlertContainer) return;
    sparkAlertTitle.textContent = title;
    sparkAlertMessage.textContent = message;
    alertCallback = callback;
    sparkAlertContent.className = 'spark-alert-content ' + type;
    sparkAlertContainer.classList.add('active');
}

// Lógica de los eventos
document.addEventListener('DOMContentLoaded', () => {
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', validateAnswer);
    }
    if (sparkAlertCloseBtn) {
        sparkAlertCloseBtn.addEventListener('click', () => {
            sparkAlertContainer.classList.remove('active');
            if (alertCallback) {
                alertCallback();
                alertCallback = null;
            }
        });
    }

    const isMenuPage = document.getElementById('menu-screen');
    const isMissionPage = document.body.id.includes('mision-');

    if (isMenuPage) {
        const storedName = localStorage.getItem('userName');
        if (!storedName) {
            window.location.href = 'index.html';
        } else {
            menuMessage.textContent = `¡Excelente, ${storedName}! Elige tu misión.`;
        }
        document.getElementById('end-mission-btn').addEventListener('click', () => {
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    } else if (isMissionPage) {
        startMissionJourney();
    }
});