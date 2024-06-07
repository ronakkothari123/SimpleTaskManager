document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.querySelector('.timer');
    const container = document.querySelector('.timer-container');
    let isRunning = false;
    let isWorkPeriod = true;
    let timer;
    let duration = 30 * 60; // 30 minutes

    const updateBackground = (timeLeft, initialDuration) => {
        const percentage = (timeLeft / initialDuration) * 100;
        const color1 = isWorkPeriod ? 'var(--bg-color-1)' : '#32cd32'; // tomato or limegreen
        const color2 = 'var(--accent-color-1)'; // limegreen
        document.body.style.background = `linear-gradient(to left, ${color1} ${percentage}%, ${color2} 0%)`;
    };

    const startTimer = () => {
        let timeLeft = duration;
        timer = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timer);
                isWorkPeriod = !isWorkPeriod;
                duration = isWorkPeriod ? 30 * 60 : 5 * 60;
                startTimer();
                return;
            }
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            updateBackground(timeLeft, duration);
        }, 1000);
    };

    container.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            startTimer();
        }
    });
});