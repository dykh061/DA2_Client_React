

// QUẢN LÝ KHÁCH HÀNG (USER MANAGEMENT)
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, InputGroup, Form } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";

import UserTable from "../components/CustomerManagementTable.jsx";
import UserForm from "../components/CustomerManagementForm.jsx";

import { getAllUsers, getUser, updateUser } from "../services/userService.js";
import { register } from "../services/authService.js";

import { useNavigate } from "react-router-dom";

const CustomerManagement = () => {
  // ================= STATE =================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);


  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  // ================= AUTH CHECK =================
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setCurrentUser(res);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();

      const list = Array.isArray(res) ? res : res?.data ?? [];

      const mapped = list.map((u) => ({
        id: u.id,
        name: u.username,
        email: u.email,
        phone: u.phone_number,
      }));

      setData(mapped);
    } catch (err) {
      console.error("Lỗi fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // ================= FORM =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const openAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", email: "", phone: "", password: "" });
    setShowModal(true);
  };


  const openEdit = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      password: "",
    });

    setShowModal(true);
  };

  // ================= CRUD =================
  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await updateUser({
          id: editingItem.id,
          ...formData,
        });
      } else {
        await register(formData.email, formData.password, {
          autoLogin: false,
        });
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);


    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Xóa người dùng này?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // ================= SEARCH =================
  const normalize = (s) =>
    s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filteredData = data.filter((u) => {
    const search = normalize(searchTerm);

    return (
      !search ||
      normalize(u.name).includes(search) ||
      normalize(u.email).includes(search)
    );


  });

  // ================= UI =================
  return (
    <div className="animate-slide-in">

      {/* HEADER */}
      <div className="d-flex justify-content-between mb-4">
        <div>

          <h2 className="fw-bold">Quản lý khách hàng</h2>
          <p className="text-muted small">Quản lý tài khoản người dùng hệ thống</p>
        </div>

        <Button onClick={openAdd}>
          <FaPlus /> Thêm
        </Button>
      </div>

      {/* SEARCH */}
      <Card className="mb-3">
        <Card.Body>
          <InputGroup>
            <Form.Control
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {/* TABLE */}
      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <UserTable
          customers={filteredData}
          onEdit={openEdit}
          onDelete={handleDelete}

        />
      )}

      {/* FORM */}
      <UserForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        customer={editingItem}
        formData={formData}
        handleChange={handleChange}


      />
    </div>
  );
};

export default CustomerManagement;
