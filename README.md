# FE Demo Nodejs — React + Vite

## Cấu trúc thư mục

```
FEDemoNodejs/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components tái sử dụng
│   │   ├── UserForm.jsx     # Form thêm / chỉnh sửa user
│   │   └── UserTable.jsx    # Bảng hiển thị danh sách user
│   ├── config/
│   │   └── api.js           # BASE_API và các endpoint
│   ├── pages/
│   │   └── UsersPage.jsx    # Trang quản lý user
│   ├── services/
│   │   └── userService.js   # Gọi API (CRUD user)
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example             # Biến môi trường mẫu (VITE_API_BASE_URL)
├── vercel.json              # Cấu hình deploy Vercel
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Cài đặt & chạy

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Biến môi trường

| Biến                  | Mô tả                  | Giá trị mặc định                          |
|-----------------------|------------------------|-------------------------------------------|
| `VITE_API_BASE_URL`   | URL server backend     | `https://da2-sever-nodejs.onrender.com`   |

> Nếu không cấu hình biến môi trường, app vẫn tự dùng server mặc định `https://da2-sever-nodejs.onrender.com`.

## Deploy Vercel

Repo này đã sẵn sàng để push lên GitHub rồi import trực tiếp vào Vercel.

- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Biến môi trường: không bắt buộc nếu dùng backend mặc định

Nếu muốn đổi backend khi deploy, thêm biến `VITE_API_BASE_URL` trong phần Environment Variables của project trên Vercel.
