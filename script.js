// Function to toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle("light-mode");

    // Store user preference in local storage
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
}

// Run this when the page loads to check for stored theme preference
document.addEventListener("DOMContentLoaded", function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    // Add event listener to the theme toggle button
    const themeToggleButton = document.getElementById("theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    }

    // Load YouTube Iframe API for video control
    let tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player; // YouTube player object

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("video-frame", {
            events: {
                "onReady": function (event) {
                    // Restore saved mute/pause state
                    let isMuted = localStorage.getItem("videoMuted") === "true";
                    let isPaused = localStorage.getItem("videoPaused") === "true";

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

    // Video Control Buttons
    let pauseButton = document.getElementById("pause-video");
    let muteButton = document.getElementById("mute-video");

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
});
