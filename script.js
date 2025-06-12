// Scroll-triggered counter animation
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");
  const speed = 200;

  const animate = () => {
    counters.forEach(counter => {
      const update = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(update, 10);
        } else {
          counter.innerText = target;
        }
      };
      update();
    });
  };

  // Only animate when visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
        observer.disconnect();
      }
    });
  });

  counters.forEach(counter => observer.observe(counter));
});
