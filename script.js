const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsFinePointer && !prefersReducedMotion) {
  let frame = null;
  let nextX = window.innerWidth / 2;
  let nextY = window.innerHeight / 2;

  window.addEventListener(
    "pointermove",
    (event) => {
      nextX = event.clientX;
      nextY = event.clientY;
      document.body.classList.add("has-pointer-glow");

      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        document.body.style.setProperty("--cursor-x", `${nextX}px`);
        document.body.style.setProperty("--cursor-y", `${nextY}px`);
        frame = null;
      });
    },
    { passive: true },
  );

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("has-pointer-glow");
  });

  window.addEventListener("pointerenter", () => {
    document.body.classList.add("has-pointer-glow");
  });
}
