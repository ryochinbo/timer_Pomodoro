const timerDisplay = document.querySelector('.timer-display');
const roundDisplay = document.querySelector('.round-display');
const workDurationSelect = document.getElementById('work-duration');
const customWorkDurationInput = document.getElementById('custom-work-duration');
const breakDurationSelect = document.getElementById('break-duration');
const customBreakDurationInput = document.getElementById('custom-break-duration');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

let timerInterval;
let totalSeconds;
let isWorking = true; // 現在作業時間か休憩時間か
let rounds = 0;
let isPaused = true;

// 通知音
const notificationSound = new Audio('notification.mp3'); // 後で作成
const countdownSound = new Audio('countdown.mp3'); // 後で作成

function getWorkDuration() {
    const customValue = parseInt(customWorkDurationInput.value);
    return !isNaN(customValue) && customValue > 0 ? customValue : parseInt(workDurationSelect.value);
}

function getBreakDuration() {
    const customValue = parseInt(customBreakDurationInput.value);
    return !isNaN(customValue) && customValue > 0 ? customValue : parseInt(breakDurationSelect.value);
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (!isPaused) return; // すでに実行中の場合は何もしない

    isPaused = false;
    // タイマー開始時に現在の設定時間を再取得
    if (isWorking) {
        totalSeconds = getWorkDuration() * 60;
    } else {
        totalSeconds = getBreakDuration() * 60;
    }
    updateTimerDisplay(); // 初期表示を更新

    timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay();

        if (totalSeconds <= 10 && totalSeconds >= 0 && !isWorking) {
            // 休憩時間の残り10秒でカウントダウン音を鳴らす
            countdownSound.play();
        }

        if (totalSeconds < 0) {
            clearInterval(timerInterval);
            notificationSound.play(); // セッション終了時の通知音

            if (isWorking) {
                // 作業セッション終了、休憩セッション開始
                rounds++;
                roundDisplay.textContent = `ラウンド: ${rounds}`;
                isWorking = false;
                alert('休憩時間です！');
            } else {
                // 休憩セッション終了、作業セッション開始
                isWorking = true;
                alert('作業時間です！');
            }
            isPaused = true; // 次のセッションのために一時停止状態に戻す
            startTimer(); // 次のセッションを自動的に開始
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    isPaused = true;
}

function resetTimer() {
    stopTimer();
    isWorking = true;
    rounds = 0;
    roundDisplay.textContent = `ラウンド: ${rounds}`;
    totalSeconds = getWorkDuration() * 60; // 初期表示は作業時間
    updateTimerDisplay();
    isPaused = true;
}

// イベントリスナー
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// 設定変更時の処理
workDurationSelect.addEventListener('change', () => {
    if (isPaused && isWorking) {
        totalSeconds = getWorkDuration() * 60;
        updateTimerDisplay();
    }
});
customWorkDurationInput.addEventListener('change', () => {
    if (isPaused && isWorking) {
        totalSeconds = getWorkDuration() * 60;
        updateTimerDisplay();
    }
});

breakDurationSelect.addEventListener('change', () => {
    if (isPaused && !isWorking) {
        totalSeconds = getBreakDuration() * 60;
        updateTimerDisplay();
    }
});
customBreakDurationInput.addEventListener('change', () => {
    if (isPaused && !isWorking) {
        totalSeconds = getBreakDuration() * 60;
        updateTimerDisplay();
    }
});

// 初期表示
resetTimer(); // 初期表示をセットするためにリセットを呼び出す
