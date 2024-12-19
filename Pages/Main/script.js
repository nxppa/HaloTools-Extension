window.addEventListener('load', () => {
    const Bar = document.getElementById("Bar");
    let opacity = 0; // Initial opacity
    const fadeDuration = 250; // Total duration of fade-in in milliseconds
    const interval = 5; // Time between opacity increments in milliseconds
    const increment = interval / fadeDuration; // Opacity increment per step

    const fadeIn = setInterval(() => {
        opacity += increment;
        console.log("INCREMEMENTING", opacity)
        if (opacity >= 1) {
            opacity = 1;
            clearInterval(fadeIn); // Stop the interval when fully visible
        }
        Bar.style.opacity = opacity;
    }, interval);
});