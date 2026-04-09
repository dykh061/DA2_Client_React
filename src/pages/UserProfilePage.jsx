import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Col, Container, Form, Row, Button } from "react-bootstrap";
import { getUser, updateUser } from "../services/userService";
import { decodeAccessToken, getToken } from "../utils/auth";

function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const tokenPayload = decodeAccessToken(getToken());
  const isAdmin = tokenPayload?.role === "admin";
  const profilePath = isAdmin ? "/admin/profile" : "/profile-user";

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await getUser();
        const currentUser = data?.data ?? data ?? null;

        setUser(currentUser);
        setFormData({
          name: currentUser?.username || "",
          email: currentUser?.email || "",
          phone: currentUser?.phone_number || "",
          password: "",
        });
      } catch (err) {
        alert(err.message);
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await updateUser(payload);

      setUser((prev) => ({
        ...(prev || {}),
        username: payload.name,
        email: payload.email,
        phone_number: payload.phone,
      }));

      setFormData((prev) => ({ ...prev, password: "" }));
      alert("Cap nhat thong tin thanh cong");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="booking-screen booking-compact">
      <header className="booking-nav">
        <div className="booking-brand">
          <span className="brand-icon">
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
          </span>
          <div>
            <strong>BadmintonHub</strong>
            <p>Dat san cau long</p>
          </div>
        </div>

        <nav className="booking-menu">
          <Link to="/" className="menu-link">
            <i className="fa-solid fa-house" aria-hidden="true"></i>
            <span>Trang chu</span>
          </Link>
          <Link to="/booking" className="menu-link">
            <i className="fa-regular fa-calendar-check" aria-hidden="true"></i>
            <span>Dat san</span>
          </Link>
          <Link to="/my-bookings" className="menu-link">
            <i className="fa-solid fa-list" aria-hidden="true"></i>
            <span>Lich cua toi</span>
          </Link>
          <Link to={profilePath} className="menu-link active">
            <i className="fa-regular fa-user" aria-hidden="true"></i>
            <span>Profile user</span>
          </Link>
        </nav>
      </header>

      <main className="booking-content">
        <section className="booking-intro">
          <h1>Profile user</h1>
          <p>Thong tin tai khoan cua ban</p>
        </section>

        <Container fluid className="p-0">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="booking-card border-0">
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Ten hien thi</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>So dien thoai</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Mat khau moi (neu doi)</Form.Label>
                        <Form.Control
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <small className="text-muted">
                        Chi xem va cap nhat thong tin cua chinh ban.
                      </small>
                    </div>
                    <Button type="submit" className="login-submit-btn px-4">
                      Luu thay doi
                    </Button>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>

        <section className="booking-card mt-3">
          <h2>Thong tin hien tai</h2>
          <p className="mb-1">
            <strong>Ten:</strong> {user?.username || "-"}
          </p>
          <p className="mb-1">
            <strong>Email:</strong> {user?.email || "-"}
          </p>
          <p className="mb-0">
            <strong>So dien thoai:</strong> {user?.phone_number || "-"}
          </p>
        </section>
      </main>
    </div>
  );
}

export default UserProfilePage;
