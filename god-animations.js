document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");

  // Nav scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // GSAP animations for Hero
  gsap.to("#heroTitle", { opacity: 1, y: -10, duration: 1, ease: "power3.out", delay: 0.2 });
  gsap.to("#heroSubtitle", { opacity: 1, y: -10, duration: 1, ease: "power3.out", delay: 0.6 });

  // Parallax blobs
  gsap.utils.toArray(".blob").forEach((blob, i) => {
    gsap.to(blob, {
      y: i % 2 === 0 ? 30 : -30,
      x: i % 2 === 0 ? -30 : 30,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
});
