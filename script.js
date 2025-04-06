// Toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    // Save preference
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    // Theme toggle button
    const themeToggleButton = document.getElementById("theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    }

    // Load YouTube Iframe API
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("video-frame", {
            events: {
                "onReady": function () {
                    const isMuted = localStorage.getItem("videoMuted") === "true";
                    const isPaused = localStorage.getItem("videoPaused") === "true";

                    if (isMuted) {
                        player.mute();
                        document.getElementById("mute-video").textContent = "Unmute";
                    }

                    if (isPaused) {
                        player.pauseVideo();
                        document.getElementById("pause-video").textContent = "Play";
                    }
                }
            }
        });
    };

    const pauseButton = document.getElementById("pause-video");
    const muteButton = document.getElementById("mute-video");

    if (pauseButton && muteButton) {
        pauseButton.addEventListener("click", function () {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
                pauseButton.textContent = "Play";
                localStorage.setItem("videoPaused", "true");
            } else {
                player.playVideo();
                pauseButton.textContent = "Pause";
                localStorage.setItem("videoPaused", "false");
            }
        });

        muteButton.addEventListener("click", function () {
            if (player.isMuted()) {
                player.unMute();
                muteButton.textContent = "Mute";
                localStorage.setItem("videoMuted", "false");
            } else {
                player.mute();
                muteButton.textContent = "Unmute";
                localStorage.setItem("videoMuted", "true");
            }
        });
    }

    // ========================
    // QUIZ LOGIC
    // ========================
    const quizForm = document.getElementById("quiz-form");

    if (quizForm) {
        quizForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let score = 0;
            let total = 5;
            let feedback = [];

            // Q1
            const q1 = quizForm.q1.value;
            if (q1 === "b") {
                score++;
                feedback.push("✅ Q1: Correct!");
            } else {
                feedback.push("❌ Q1: The correct answer is 'Sharing hypertext among researchers'.");
            }

            // Q2
            const q2 = quizForm.q2.value;
            if (q2 === "c") {
                score++;
                feedback.push("✅ Q2: Correct!");
            } else {
                feedback.push("❌ Q2: The correct answer is 'HTML5'.");
            }

            // Q3
            const q3 = quizForm.q3.value;
            if (q3 === "b") {
                score++;
                feedback.push("✅ Q3: Correct!");
            } else {
                feedback.push("❌ Q3: The correct answer is 'They allow websites to function offline'.");
            }

            // Q4
            const q4 = quizForm.q4.value.trim().toLowerCase();
            if (q4 === "tim berners lee" || q4 === "berners lee") {
                score++;
                feedback.push("✅ Q4: Correct!");
            } else {
                feedback.push("❌ Q4: The correct answer is 'Tim Berners Lee'.");
            }

            // Q5 (multi-select)
            const q5Correct = ["b", "c", "e"];
            const q5Checked = [...quizForm.querySelectorAll("input[name='q5']:checked")].map(i => i.value);
            const isQ5Correct = q5Checked.length === q5Correct.length && q5Correct.every(val => q5Checked.includes(val));

            if (isQ5Correct) {
                score++;
                feedback.push("✅ Q5: Correct!");
            } else {
                feedback.push("❌ Q5: Correct answers are 'article', 'section', and 'header'.");
            }

            // Show Results
            const resultDiv = document.getElementById("quiz-result");
            const passed = score >= 4;

            resultDiv.innerHTML = `
              <div class="result-box ${passed ? "pass" : "fail"}">
                <h2>Quiz Results</h2>
                <p><strong>Total Score:</strong> ${score} / ${total}</p>
                <p><strong>Status:</strong> ${passed ? "✅ <span style='color:#00ffcc;'>Pass</span>" : "❌ <span style='color:#ff0033;'>Fail</span>"}</p>
                <ul style="text-align: left; margin-top: 15px;">
                  ${feedback.map(msg => `<li>${msg}</li>`).join("")}
                </ul>
              </div>
            `;

            // 🎉 Confetti on pass
            if (passed && typeof confetti === "function") {
                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ["#00ffff", "#ff00ff", "#ffff00", "#00ffcc"]
                });
            }
        });

        // Clear results on Restart
        const resetButton = document.getElementById("reset-quiz");
        if (resetButton) {
            resetButton.addEventListener("click", function () {
                const resultDiv = document.getElementById("quiz-result");
                if (resultDiv) {
                    resultDiv.innerHTML = "";
                }
            });
        }
    }
});
