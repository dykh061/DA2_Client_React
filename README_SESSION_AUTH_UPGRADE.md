# Session Auth Upgrade - FE + BE Context

Tai lieu nay mo ta chi tiet cac thay doi de FE dap ung yeu cau:

- Luu phien dang nhap khi dong/mo lai trinh duyet.
- Tu dong refresh access token khi het han hoac mat token.
- Neu refresh that bai thi xoa phien cu va dieu huong ve trang login.

## 1) Tong quan van de truoc khi sua

### Truoc sua (van de)

- FE goi `fetch` phan tan o nhieu file (`authService`, `userService`, `bookingService`).
- Moi page tu tu check token het han bang `atob` + `exp`.
- Co nhieu doan `throw` truoc `if (401/403)`, nen logic redirect/xoa session khong bao gio chay.
- Chua co co che refresh token tu dong tai 1 diem trung tam.
- Chua co bootstrap session khi mo lai app.

### Sau sua (ket qua)

- FE co 1 API client trung tam de quan ly token, refresh, retry request.
- App khoi dong co buoc `restoreSession()` de thu lay lai `accessToken` tu `/auth/refresh`.
- Route private duoc bao ve bang `ProtectedRoute`.
- Neu refresh fail: xoa session va day user ve login.
- Login/Register nhan cookie refresh token dung cach qua `credentials: include`.

## 2) BE dang cap token nhu the nao (boi canh can biet)

Tu backend trong folder `DemoNodejs`:

- Access token duoc tra trong JSON response khi login/register/refresh.
  - `POST /auth/login` -> body co `accessToken`
  - `POST /auth/register` -> body co `accessToken`
  - `POST /auth/refresh` -> body co `accessToken`
- Refresh token KHONG dua vao JSON body cho FE luu localStorage.
- Refresh token duoc BE set vao cookie httpOnly:
  - cookie name: `refreshToken`
  - set trong `AuthController.setRefreshTokenCookie(...)`
  - browser tu luu cookie, FE JS khong doc truc tiep duoc (bao mat hon)
- Muon trinh duyet gui cookie refresh len BE thi FE phai goi request voi `credentials: include`.

## 3) Cac file FE da sua va ly do sua

## 3.1 API endpoint auth

- File: `src/config/api.js`

### Truoc

- Chi co `REGISTER`, `LOGIN`.

### Sau

- Them `AUTH.LOGOUT` va `AUTH.REFRESH`.

### Ly do

- FE can endpoint ro rang de tu dong refresh va logout dung quy trinh.

## 3.2 Session utility

- File: `src/utils/auth.js`

### Truoc

- Chi co `getToken()`, `getUser()`, `logout()` don gian.

### Sau

- Them cac ham:
  - `setToken`, `setUser`
  - `clearSession`
  - `markLoggedIn`
- Them event auth:
  - `auth:login`
  - `auth:logout`

### Ly do

- Dong bo trang thai auth toan app, tranh moi page tu xu ly theo cach rieng.

## 3.3 API client trung tam (phan quan trong nhat)

- File moi: `src/services/apiClient.js`

### Truoc

- Moi service tu viet `fetch`, tu bat loi.

### Sau

- Co `publicRequest(...)` cho login/register.
- Co `apiRequest(...)` cho request can access token.
- Tu dong refresh khi gap `401/403`:
  1. Goi `POST /auth/refresh` (credentials include)
  2. Nhan access token moi
  3. Retry request cu 1 lan
- Neu refresh that bai:
  - `clearSession()`
  - throw thong bao het phien
- Co `restoreSession()` dung luc app khoi dong.
- Co `logoutSession()` de goi `/auth/logout` roi xoa phien.

### Ly do

- Don diem xu ly auth, tranh duplicate code va dam bao hanh vi dong nhat.

## 3.4 Auth service

- File: `src/services/authService.js`

### Truoc

- Tu goi fetch va co doan logic 401 dat sau `throw`.

### Sau

- Dung `publicRequest` + `logoutSession`.
- `login(...)`: luu session qua `markLoggedIn(...)`.
- `register(...)`: ho tro option `{ autoLogin }`.

### Ly do

- Bao dam login/register luu phien dung cach.
- Tranh loi nghiep vu o trang admin tao user:
  - admin create user qua register nhung khong bi doi session (`autoLogin: false`).

## 3.5 User service + Booking service

- Files:
  - `src/services/userService.js`
  - `src/services/bookingService.js`

### Truoc

- Tu gan header token, tu bat loi.

### Sau

- Dung `apiRequest(...)`.

### Ly do

- Tat ca request private deu duoc auto-refresh thong qua 1 co che duy nhat.

## 3.6 App routing + bootstrap session

- File: `src/App.jsx`

### Truoc

- Chua bootstrap session khi vao app.
- Route private chua duoc guard tap trung.

### Sau

- Khi app mount:
  - goi `restoreSession()`
  - neu co refresh cookie hop le, app lay duoc access token moi
- Them listeners `auth:login` va `auth:logout` de cap nhat state auth.
- Bao ve route private bang `ProtectedRoute`:
  - `/booking`
  - `/my-bookings`
  - `/admin/*`
- Neu da dang nhap thi vao `/login` hoac `/register` se redirect ve `/my-bookings`.

### Ly do

- Dap ung yeu cau: dong/mo lai web van vao duoc neu refresh cookie con han.

## 3.7 ProtectedRoute

- File moi: `src/components/ProtectedRoute.jsx`

### Nhiem vu

- Chan route private neu khong co access token.
- Dieu huong ve `/login`.

### Ly do

- Tach logic bao ve route ra 1 component de tai su dung.

## 3.8 Cac page da bo logic check token thu cong

- Files da don dep:
  - `src/pages/HomePage.jsx`
  - `src/pages/UsersPage.jsx`
  - `src/pages/MyBookingsPage.jsx`
  - `src/pages/ProfilePage.jsx`
  - `src/pages/CustomerManagement.jsx`
  - `src/components/AdminLayout.jsx`

### Truoc

- Moi page tu check exp, tu clear localStorage.

### Sau

- Chi goi service nghiep vu (`getUser`, ...).
- Neu token het han, `apiClient` tu refresh.
- Neu refresh fail, session bi clear va dieu huong login.

### Ly do

- Tranh code lap, tranh sai logic va kho bao tri.

## 4) Luong chay sau khi sua

1. User login:

- FE goi `/auth/login` voi `credentials: include`.
- BE tra `accessToken` trong JSON + set refresh cookie httpOnly.
- FE luu access token vao localStorage.

2. User dong browser, vao lai:

- FE khoi dong app, goi `restoreSession()`.
- Neu localStorage khong co access token, FE goi `/auth/refresh`.
- Trinh duyet tu gui refresh cookie sang BE.
- BE cap access token moi -> FE luu lai -> user khong can login lai.

3. Dang su dung ma access token het han / bi mat:

- Request private bi 401/403.
- `apiRequest()` tu dong goi `/auth/refresh` va retry request cu.

4. Refresh fail (cookie het han/bi xoa/khong hop le):

- `clearSession()`
- app nhan event `auth:logout`
- user bi day ve `/login`.

## 5) Cac quy tac co ban team can giu

1. Khong goi `fetch` truc tiep cho API private nua, phai di qua `apiRequest`.
2. Moi request auth can cookie refresh thi phai co `credentials: include`.
3. Khong tu decode JWT o tung page de check han, de `apiClient` xu ly.
4. Logout luon goi `/auth/logout` truoc khi xoa session local.
5. Khong luu refresh token vao localStorage/sessionStorage.

## 6) Dieu kien moi truong de flow chay on dinh

- BE CORS phai cho phep domain FE va `credentials: true`.
- Neu production HTTPS:
  - refresh cookie nen de `secure=true`
  - `sameSite=none` khi FE va BE khac domain.
- FE phai dung dung `VITE_API_BASE_URL` va endpoint `/auth/refresh`.

## 7) Xac nhan sau khi sua

Da build FE thanh cong:

- Lenh: `npm run build`
- Ket qua: build pass, khong loi compile.
