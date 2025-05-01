// === Theme + Video Control ===
function toggleTheme() {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Load Theme
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
    }
  
    const themeToggleButton = document.getElementById("theme-toggle");
    if (themeToggleButton) themeToggleButton.addEventListener("click", toggleTheme);
  
    // YouTube Player Setup
    let player;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("video-frame", {
        events: {
          onReady: () => {
            if (localStorage.getItem("videoMuted") === "true") {
              player.mute();
              document.getElementById("mute-video").textContent = "Unmute";
            }
            if (localStorage.getItem("videoPaused") === "true") {
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
      pauseButton.addEventListener("click", () => {
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
  
      muteButton.addEventListener("click", () => {
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
  
    // === Dynamic Quiz Engine ===
    const quizData = [
      {
        question: "What was the original purpose of the World Wide Web when Tim Berners-Lee created it?",
        options: ["Social networking", "Sharing hypertext among researchers", "Online shopping", "Multimedia streaming"],
        answer: "Sharing hypertext among researchers"
      },
      {
        question: "Which version of HTML introduced semantic elements like &lt;article&gt; and &lt;section&gt;?",
        options: ["HTML 4.01", "HTML3", "HTML5", "XHTML"],
        answer: "HTML5"
      },
      {
        question: "What is one major benefit of HTML5's APIs?",
        options: [
          "They require Flash to run multimedia",
          "They allow websites to function offline",
          "They slow down mobile web performance",
          "They prevent search engines from indexing content"
        ],
        answer: "They allow websites to function offline"
      },
      {
        question: "Fill in the blank: The first web browser, which also served as an editor, was created by ________.",
        input: true,
        answer: ["tim berners lee", "berners lee"]
      },
      {
        question: "Which of the following are semantic HTML elements? (Select all that apply)",
        checkboxes: true,
        options: [
          { label: "&lt;div&gt;", value: "div" },
          { label: "&lt;article&gt;", value: "article" },
          { label: "&lt;section&gt;", value: "section" },
          { label: "&lt;span&gt;", value: "span" },
          { label: "&lt;header&gt;", value: "header" }
        ],
        answer: ["article", "section", "header"]
      }
    ];
  
    let currentIndex = 0;
    let score = 0;
  
    const container = document.getElementById("quiz-container");
  
    function renderQuestion() {
      const q = quizData[currentIndex];
      container.innerHTML = `
        <div class="quiz-box">
          <h2>Question ${currentIndex + 1} of ${quizData.length}</h2>
          <p class="question-text">${q.question}</p>
          <form id="question-form">
            ${q.options ? q.options.map(option => `
              <label class="quiz-option">
                <input type="${q.checkboxes ? "checkbox" : "radio"}" name="response" value="${option.value || option}" />
                ${option.label || option}
              </label>
            `).join("") : ""}
            ${q.input ? `
              <input type="text" name="textInput" placeholder="Type your answer here" class="quiz-input"/>
            ` : ""}
            <button type="submit" class="neon-btn">Next</button>
          </form>
          <div id="feedback" style="margin-top: 15px;"></div>
        </div>
      `;
  
      document.getElementById("question-form").addEventListener("submit", handleSubmit);
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      const q = quizData[currentIndex];
      let userAnswer;
  
      if (q.input) {
        userAnswer = event.target.textInput.value.trim().toLowerCase();
        if (q.answer.includes(userAnswer)) score++;
      } else if (q.checkboxes) {
        const selected = [...event.target.querySelectorAll("input[type='checkbox']:checked")].map(cb => cb.value);
        const isCorrect = selected.length === q.answer.length && q.answer.every(ans => selected.includes(ans));
        if (isCorrect) score++;
      } else {
        const selected = event.target.querySelector("input[type='radio']:checked");
        if (!selected) return; // Require answer
        if (selected.value === q.answer) score++;
      }
  
      currentIndex++;
      if (currentIndex < quizData.length) {
        renderQuestion();
      } else {
        showResults();
      }
    }
  
    function showResults() {
      const passed = score >= 4;
      container.innerHTML = `
        <div class="result-box ${passed ? "pass" : "fail"}">
          <h2>Quiz Completed</h2>
          <p><strong>Your Score:</strong> ${score} / ${quizData.length}</p>
          <p><strong>Status:</strong> ${passed ? "✅ <span style='color:#00ffcc;'>Pass</span>" : "❌ <span style='color:#ff0033;'>Fail</span>"}</p>
          <button class="neon-btn" id="restart-btn">Restart Quiz</button>
        </div>
      `;
  
      if (passed && typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#00ffff", "#ff00ff", "#ffff00", "#00ffcc"]
        });
      }
  
      document.getElementById("restart-btn").addEventListener("click", () => {
        currentIndex = 0;
        score = 0;
        renderQuestion();
      });
    }
  
    renderQuestion(); // Start the quiz!
  });
