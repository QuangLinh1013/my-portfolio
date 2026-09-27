# My 3D Portfolio

Portfolio cá nhân của Ngo Quang Linh, tập trung vào Software Engineering và Backend Development. Website gồm trang Work giới thiệu năng lực, tech stack, dự án và cách liên hệ; trang Info chia sẻ thêm về kinh nghiệm và câu chuyện cá nhân. Nền 3D tương tác, hiệu ứng cuộn và chuyển động được dùng xuyên suốt giao diện.

## Công nghệ

- [Vite](https://vite.dev/) để phát triển và build website.
- [Three.js](https://threejs.org/) để render cảnh 3D bằng WebGL.
- [GSAP](https://gsap.com/) và ScrollTrigger cho animation, parallax và chuyển động theo cuộn.
- [Lenis](https://github.com/darkroomengineering/lenis) cho hiệu ứng cuộn mượt.
- Sass cho stylesheet.

## Yêu cầu

- Node.js tương thích với Vite 8 (Node.js `20.19+` hoặc `22.12+`).
- npm.
- Trình duyệt hỗ trợ WebGL để hiển thị nền 3D.

## Bắt đầu

Chạy các lệnh sau trong thư mục dự án:

```bash
npm install
npm run dev
```

Vite sẽ in địa chỉ local trong terminal, thường là `http://localhost:5173`.

## Lệnh

```bash
npm run dev      # Chạy server phát triển
npm run build    # Build website vào thư mục dist/
npm run preview  # Xem thử bản build đã tạo
```

## Các trang

- `/` — Trang Work: giới thiệu, kỹ năng, tech stack, dự án tiêu biểu, quy trình làm việc và liên hệ.
- `/info/` — Trang Info: thông tin cá nhân, câu chuyện và hình ảnh.

Đây là cấu hình Vite nhiều trang. Khi deploy, cần publish nội dung trong `dist/` và cấu hình host phục vụ `info/index.html` tại đường dẫn `/info/`.

## Cấu trúc thư mục

```text
.
├── index.html                 # Trang Work
├── info/
│   └── index.html             # Trang Info
├── public/                    # Tài nguyên tĩnh
└── src/
    ├── assets/                # Hình ảnh và asset
    ├── components/
    │   └── floating-menu.js   # Điều hướng và liên kết mạng xã hội
    ├── pages/
    │   ├── home.js            # Hiệu ứng và cảnh 3D trang Work
    │   └── info.js            # Hiệu ứng và cảnh 3D trang Info
    └── styles/
        └── main.scss          # Giao diện dùng chung
```

## Trước khi public

Trang Work hiện dùng địa chỉ email mẫu `your.email@example.com` cho nút liên hệ. Liên kết Resume trong menu hiện trỏ tới Google; hãy thay cả hai bằng thông tin thật trước khi chia sẻ portfolio rộng rãi.