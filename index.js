// Referencias a elementos del DOM en la página de bienvenida
const startMissionBtn = document.getElementById('start-mission-btn');
const usernameInput = document.getElementById('username-input');
const loadingScreen = document.getElementById('loading-screen');
const homeScreen = document.getElementById('home-screen');
const backgroundMusic = document.getElementById('background-music');

// Función para reproducir voz
function playSparkVoice(audioFile) {
    console.log(`Reproduciendo audio: ${audioFile}`);
    const audio = new Audio(`audios/${audioFile}`);
    audio.play().catch(error => {
        console.error(`Error al intentar reproducir el audio ${audioFile}:`, error);
    });
}

// Lógica al cargar la página de bienvenida
document.addEventListener('DOMContentLoaded', () => {
    // Muestra la pantalla de inicio después de la pantalla de carga
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        loadingScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        homeScreen.classList.add('active');
    }, 2000);
});

// Lógica al hacer clic en el botón de "Empezar Misión"
if (startMissionBtn) {
    startMissionBtn.addEventListener('click', () => {
        backgroundMusic.play().catch(error => {
            console.error("Error al reproducir la música de fondo:", error);
        });
        
        const userName = usernameInput.value || 'Cadete';
        localStorage.setItem('userName', userName);
        
        playSparkVoice('audios/bienvenido.mp3');
        
        // Redirigir a la página principal (menú)
        window.location.href = 'bienvenida.html';
    });

}

