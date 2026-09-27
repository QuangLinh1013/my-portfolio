import "../styles/main.scss";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { renderFloatingMenu } from "../components/floating-menu.js";

gsap.registerPlugin(ScrollTrigger);
renderFloatingMenu();

/* ==========================================
   CẤU HÌNH LENIS (CUỘN MƯỢT)
========================================== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
});

// Đồng bộ ScrollTrigger với Lenis (Rất quan trọng để hiệu ứng chuẩn xác)
lenis.on("scroll", ScrollTrigger.update);

/* ==========================================
   HIỆU ỨNG GSAP (CHỮ HIỆN RA KHI CUỘN)
========================================== */
const revealTextElements = document.querySelectorAll(".reveal-text");

revealTextElements.forEach((el) => {
  gsap.fromTo(
    el,
    {
      opacity: 0, // Bắt đầu ở trạng thái tàng hình
      y: 50, // Bắt đầu ở vị trí thấp hơn 50px
    },
    {
      opacity: 1, // Hiện rõ
      y: 0, // Trượt về vị trí ban đầu
      duration: 1, // Thời gian chạy hiệu ứng là 1 giây
      ease: "power3.out", // Gia tốc hiệu ứng (trượt nhanh ban đầu, chậm dần về sau)
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // Hiệu ứng chạy khi Đỉnh (top) của chữ chạm tới 85% chiều cao màn hình
        toggleActions: "play none none reverse", // Lướt xuống thì chạy (play), lướt lên thì tua ngược (reverse)
      },
    },
  );
});

/* ==========================================
   PARALLAX NỘI DUNG KHI CUỘN
========================================== */
gsap.utils.toArray(".content").forEach((content) => {
  gsap.to(content, {
    yPercent: -12,
    ease: "none",
    scrollTrigger: {
      trigger: content.closest("section"),
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
});

/* ==========================================
   THREE.JS - BACKGROUND 3D (CỰC NGẦU)
========================================== */
const canvas = document.querySelector("#webgl-canvas");

// 1. Tạo cảnh (Scene)
const scene = new THREE.Scene();

// 2. Tạo Camera (Góc nhìn)
const camera = new THREE.PerspectiveCamera(
  68,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.z = 5; // Lùi camera ra xa một chút để nhìn thấy vật thể

// 3. Khởi tạo Renderer (Bộ vẽ đồ họa)
camera.position.z = 4.15;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // Cho phép nền trong suốt
  antialias: true, // Khử răng cưa giúp viền mượt hơn
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Tạo vật thể 3D (Dùng TorusKnot - Hình thắt nút dạng lưới nhìn rất công nghệ)
const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 150, 20); // Tăng số lượng điểm
// Không dùng MeshStandardMaterial nữa, chuyển sang PointsMaterial
const material = new THREE.PointsMaterial({
  size: 0.022, // Kích thước hạt
  color: 0xf4efe7,
  transparent: true,
  opacity: 0.92,
  blending: THREE.AdditiveBlending, // Hiệu ứng phát sáng nhẹ khi các hạt xếp chồng lên nhau
});
// Đổi Mesh thành Points
const torusKnot = new THREE.Points(geometry, material);
torusKnot.scale.setScalar(1.28);
material.size = 0.032;
material.opacity = 0.96;
material.depthWrite = false;

const glowGeometry = new THREE.TorusKnotGeometry(1.75, 0.48, 180, 18);
const glowMaterial = new THREE.PointsMaterial({
  size: 0.07,
  color: 0xc8b79b,
  transparent: true,
  opacity: 0.16,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const torusGlow = new THREE.Points(glowGeometry, glowMaterial);
torusGlow.scale.setScalar(1.42);

const orbitGeometry = new THREE.BufferGeometry();
const orbitPositions = new Float32Array(260 * 3);
for (let index = 0; index < orbitPositions.length; index += 3) {
  const angle = (index / 3 / 260) * Math.PI * 2;
  const radius = 3.05 + Math.sin(angle * 5) * 0.12;
  orbitPositions[index] = Math.cos(angle) * radius;
  orbitPositions[index + 1] = Math.sin(angle) * 0.42;
  orbitPositions[index + 2] = Math.sin(angle) * radius * 0.36;
}
orbitGeometry.setAttribute("position", new THREE.BufferAttribute(orbitPositions, 3));
const orbitParticles = new THREE.Points(
  orbitGeometry,
  new THREE.PointsMaterial({
    size: 0.02,
    color: 0xc8b79b,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);

const mouseParallax = new THREE.Group();
mouseParallax.position.x = 1.15;
mouseParallax.position.y = -0.1;
mouseParallax.rotation.z = -0.18;
mouseParallax.add(torusGlow);
mouseParallax.add(torusKnot);
mouseParallax.add(orbitParticles);
scene.add(mouseParallax);

const mouseTarget = { x: 0, y: 0 };
const mousePosition = { x: 0, y: 0 };

// 5. Thêm Ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
  mousePosition.x += (mouseTarget.x - mousePosition.x) * 0.08;
  mousePosition.y += (mouseTarget.y - mousePosition.y) * 0.08;
  mouseParallax.position.x = 1.15 + mousePosition.x;
  mouseParallax.position.y = -0.1 + mousePosition.y;
  torusKnot.rotation.x += 0.0024;
  torusKnot.rotation.y += 0.006;
  torusGlow.rotation.x -= 0.0012;
  torusGlow.rotation.y += 0.0038;
  orbitParticles.rotation.y -= 0.0028;
  orbitParticles.rotation.z += 0.0016;
  renderer.render(scene, camera);
});
gsap.ticker.lagSmoothing(0);

// 6. Cập nhật kích thước khi kéo giãn cửa sổ trình duyệt
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
/* ==========================================
   TƯƠNG TÁC CHUỘT VỚI 3D (PARALLAX)
========================================== */
window.addEventListener("mousemove", (event) => {
  // Chuẩn hóa tọa độ chuột từ khoảng -1 đến 1
  mouseTarget.x = ((event.clientX / window.innerWidth) - 0.5) * 1.4;
  mouseTarget.y = -((event.clientY / window.innerHeight) - 0.5) * 1.4;
});

/* ==========================================
   ĐỒNG BỘ 3D VỚI CUỘN TRANG (SCRUB)
========================================== */
const scrollMotion = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.8,
    invalidateOnRefresh: true,
  },
});

scrollMotion
  .to(torusKnot.position, {
    x: 1.2,
    z: 0.8,
    duration: 1,
    ease: "none",
  })
  .to(torusGlow.position, {
    x: 0.8,
    z: 0.45,
    duration: 1,
    ease: "none",
  }, "<")
  .to(orbitParticles.position, {
    x: 0.55,
    z: 0.35,
    duration: 1,
    ease: "none",
  }, "<")
  .to(torusKnot.position, {
    x: -1.15,
    z: -1.2,
    duration: 1,
    ease: "none",
  })
  .to(torusGlow.position, {
    x: -0.9,
    z: -0.75,
    duration: 1,
    ease: "none",
  }, "<")
  .to(orbitParticles.position, {
    x: -0.55,
    z: -0.65,
    duration: 1,
    ease: "none",
  }, "<")
  .to(torusKnot.position, {
    x: 0,
    z: 0,
    duration: 1,
    ease: "none",
  })
  .to(torusGlow.position, {
    x: 0,
    z: 0,
    duration: 1,
    ease: "none",
  }, "<")
  .to(orbitParticles.position, {
    x: 0,
    z: 0,
    duration: 1,
    ease: "none",
  }, "<");
