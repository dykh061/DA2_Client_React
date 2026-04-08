import React, { useEffect } from "react";
import { Nav, Navbar, Container, Dropdown, Image } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaTableTennis,
  FaHistory,
  FaCalendarAlt,
  FaStar,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";
import { logout } from "../services/authService";
const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const currentUser = user?.data ?? user ?? null;
  const menuItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { title: "Người dùng", path: "/admin/customers", icon: <FaUsers /> },
    { title: "Quản lý Sân", path: "/admin/courts", icon: <FaTableTennis /> },
    { title: "Đặt sân", path: "../my-bookings", icon: <FaCalendarAlt /> },
    { title: "Lịch sử", path: "/admin/history", icon: <FaHistory /> },
    { title: "Đánh giá", path: "/admin/reviews", icon: <FaStar /> },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        alert(err.message);
        navigate("../login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">CL</div>
          <h4 className="m-0 fw-bold text-white">DatSanCaulong Admin</h4>
        </div>

        <div className="sidebar-divider"></div>

        <Nav className="flex-column sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Nav.Link
                as={Link}
                to={item.path}
                key={item.path}
                className={`nav-item-custom ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
                {isActive && (
                  <FaChevronRight className="ms-auto active-arrow" size={10} />
                )}
              </Nav.Link>
            );
          })}
        </Nav>

        <div className="sidebar-footer">
          <Nav.Link as="button" onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">
              <FaSignOutAlt />
            </span>
            <span>Đăng xuất</span>
          </Nav.Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="content-wrapper">
        <Navbar className="navbar-custom px-4 shadow-sm">
          <Container fluid className="p-0">
            <div className="breadcrumb-wrapper">
              <Link to="/" className="menu-link">
                <i className="fa-solid fa-house" aria-hidden="true"></i>
                <span>Trang chủ</span>
              </Link>
            </div>

            <Navbar.Collapse className="justify-content-end">
              <Dropdown align="end" className="profile-dropdown">
                <Dropdown.Toggle as="div" className="user-profile-toggle">
                  <div className="user-info d-none d-sm-block">
                    <span className="user-name">
                      {currentUser?.username || ""}
                    </span>
                    {/* <span className="user-role">Administrator</span> */}
                  </div>
                  <div className="avatar-wrapper">
                    <Image
                      src="https://ui-avatars.com/api/?name=Admin+User&background=4318FF&color=fff"
                      roundedCircle
                      className="avatar-img"
                    />
                    <span className="online-status"></span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-custom border-0 shadow-lg mt-3">
                  <Dropdown.Header>Tài khoản</Dropdown.Header>
                  <Dropdown.Item as={Link} to="/admin/profile">
                    Trang cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item href="#settings">Cài đặt</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <section className="admin-page-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
