// renderer.js
let countdown;
let timeLeft;
let isRunning = false;
let isAlarmPlaying = false;

const startButton = document.getElementById('startTimer');
const stopButton = document.getElementById('stopTimer');
const countdownDisplay = document.getElementById('countdown');
const timerDurationInput = document.getElementById('timerDuration');
const soundSelect = document.getElementById('soundSelect');
const timerSound = document.getElementById('timerSound');

const sounds = {
    beep: 'sounds/beep.mp3',
    bell: 'sounds/bell.mp3',
    chime: 'sounds/chime.mp3'
};

startButton.addEventListener('click', () => {
    if (!isRunning) {
        startTimer();
    }
    animateButton(startButton);
});

stopButton.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    }
    animateButton(stopButton);
});

timerDurationInput.addEventListener('change', () => {
    if (!isRunning) {
        timeLeft = timerDurationInput.value * 60;
        updateTimerDisplay();
    }
});

soundSelect.addEventListener('change', () => {
    timerSound.src = sounds[soundSelect.value];
});

function startTimer() {
    isRunning = true;
    startButton.textContent = '再開';
    if (!timeLeft || timeLeft <= 0) {
        timeLeft = timerDurationInput.value * 60;
    }
    countdown = setInterval(updateCountdown, 1000);
}

function stopTimer() {
    isRunning = false;
    startButton.textContent = '開始';
    clearInterval(countdown);
}

function updateCountdown() {
    if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
    } else {
        stopTimer();
        playAlarmUntilConfirmed();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownDisplay.innerHTML = `${minutes}:${seconds}`;
}

function animateButton(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
}

function playAlarmUntilConfirmed() {
    isAlarmPlaying = true;
    timerSound.loop = true;
    timerSound.play();
    
    const confirmMessage = "タイマーが終了しました！\n\n問題が解決しませんでしたか？誰かに相談することをおすすめします。\n\nOKを押すとアラームが停止します。";
    
    // カスタムダイアログを作成
    const dialogOverlay = document.createElement('div');
    dialogOverlay.style.position = 'fixed';
    dialogOverlay.style.top = '0';
    dialogOverlay.style.left = '0';
    dialogOverlay.style.width = '100%';
    dialogOverlay.style.height = '100%';
    dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogOverlay.style.display = 'flex';
    dialogOverlay.style.justifyContent = 'center';
    dialogOverlay.style.alignItems = 'center';
    dialogOverlay.style.zIndex = '1000';

    const dialogBox = document.createElement('div');
    dialogBox.style.backgroundColor = 'white';
    dialogBox.style.padding = '20px';
    dialogBox.style.borderRadius = '10px';
    dialogBox.style.maxWidth = '80%';

    const messageElement = document.createElement('p');
    messageElement.textContent = confirmMessage;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.marginTop = '10px';
    okButton.addEventListener('click', () => {
        stopAlarm();
        document.body.removeChild(dialogOverlay);
    });

    dialogBox.appendChild(messageElement);
    dialogBox.appendChild(okButton);
    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);
}

function stopAlarm() {
    timerSound.pause();
    timerSound.currentTime = 0;
    timerSound.loop = false;
    isAlarmPlaying = false;
    timeLeft = timerDurationInput.value * 60;
    updateTimerDisplay();
}

// 初期設定
timeLeft = timerDurationInput.value * 60;
updateTimerDisplay();
timerSound.src = sounds[soundSelect.value];

// ターミナルからの呼び出しに対応するためのIPC通信
const { ipcRenderer } = require('electron');

ipcRenderer.on('start-timer', (event, duration) => {
    timerDurationInput.value = duration;
    timeLeft = duration * 60;
    updateTimerDisplay();
    startTimer();
});