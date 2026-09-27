import "../styles/main.scss";
import { renderFloatingMenu } from "../components/floating-menu.js";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

// Khởi tạo menu
renderFloatingMenu();

// Đăng ký GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector("#webgl-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 7;

let renderer;

try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
} catch (error) {
  canvas.hidden = true;
  console.warn("WebGL is unavailable; continuing without the background animation.", error);
}

const starPositions = new Float32Array(900 * 3);
for (let index = 0; index < starPositions.length; index += 3) {
  starPositions[index] = (Math.random() - 0.5) * 18;
  starPositions[index + 1] = (Math.random() - 0.5) * 14;
  starPositions[index + 2] = (Math.random() - 0.5) * 12 - 2;
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({ color: 0xc8b79b, size: 0.025, transparent: true, opacity: 0.8 }),
);
const spaceGroup = new THREE.Group();
spaceGroup.add(stars);

scene.add(spaceGroup);

const spaceMouse = { x: 0, y: 0 };
const spaceMouseCurrent = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  spaceMouse.x = (event.clientX / window.innerWidth - 0.5) * 0.6;
  spaceMouse.y = -(event.clientY / window.innerHeight - 0.5) * 0.6;
});

const renderSpace = (time) => {
  spaceMouseCurrent.x += (spaceMouse.x - spaceMouseCurrent.x) * 0.04;
  spaceMouseCurrent.y += (spaceMouse.y - spaceMouseCurrent.y) * 0.04;
  
  // Tốc độ xoay nhanh hơn
  stars.rotation.y = time * 0.18;
  stars.rotation.x = time * 0.08;

  spaceGroup.position.x = spaceMouseCurrent.x * 0.08;
  spaceGroup.position.y = spaceMouseCurrent.y * 0.08;
  
  if (renderer) renderer.render(scene, camera);
};

gsap.ticker.add(renderSpace);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
});

// Khởi tạo Lenis cho cuộn mượt
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const revealItems = document.querySelectorAll(".reveal-item");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  gsap.set(revealItems, { opacity: 1, clearProps: "transform" });
} else {
  revealItems.forEach((element, index) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 56 },
      {
        opacity: 1,
        y: 0,
        duration: 1.05,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          end: "top 55%",
          toggleActions: "play none none reverse",
        },
      },
    );

    const image = element.querySelector("img");
    if (image) {
      gsap.fromTo(
        element,
        { clipPath: "inset(8% 8% 8% 8% round 1.25rem)", scale: 1.04 },
        {
          clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        image,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(image, {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });
    }
  });
}

const refreshScrollTriggers = () => ScrollTrigger.refresh();
window.addEventListener("load", refreshScrollTriggers, { once: true });
requestAnimationFrame(refreshScrollTriggers);

