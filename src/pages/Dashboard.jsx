// TỔNG QUAN HỆ THỐNG - DASHBOARD STANDARD
import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaMoneyBillWave, FaChartPie, FaClock } from "react-icons/fa";
import { getBookingStatistics } from "../services/bookingService.js";
import axios from "axios";

const Dashboard = () => {
  // ================= STATE =================
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBills: 0,
    // occupancyRate: 0,
    // peakHours: [],
  });

  const [loading, setLoading] = useState(false);

  // ================= API =================
  useEffect(() => {
  const fetchStats = async () => {
    setLoading(true);
    try {
      const data= await getBookingStatistics();

      // const data = res?.data || res || {};
      setStats({
        totalRevenue: data?.totalRevenue || 0,
        totalBills: data?.totalBills || 0,
        // occupancyRate:  0,
        // peakHours:  [],
      });
    } catch (err) {
      console.error( err);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);
  // ================= FORMAT STATS =================
  const statsDisplay = [
    {
      title: "Tổng doanh thu",
      value: `${(stats.totalRevenue || 0).toLocaleString()} VND`,
      icon: <FaMoneyBillWave />,
      color: "success",
      trend: `${stats.totalBills} hóa đơn`,
    },
    // {
    //   title: "Tỷ lệ lấp đầy",
    //   value: `${stats.occupancyRate || 0}%`,
    //   icon: <FaChartPie />,
    //   color: "primary",
    //   trend: "Hiệu suất sân",
    // },
    // {
    //   title: "Giờ cao điểm",
    //   value:
    //     stats.peakHours.length > 0
    //       ? stats.peakHours.join(", ")
    //       : "Chưa có dữ liệu",
    //   icon: <FaClock />,
    //   color: "warning",
    //   trend: "Khung giờ vàng",
    // },
  ];

  // ================= UI =================
  return (
    <div className="animate-slide-in">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Tổng quan hệ thống</h2>
        <p className="text-muted small">
          Thống kê doanh thu, hiệu suất và giờ cao điểm
        </p>
      </div>

      {/* STATS */}
      {loading ? (
        <p className="text-center py-4">Đang tải dữ liệu...</p>
      ) : (
        <Row className="g-4 mb-4">

          {statsDisplay.map((stat, idx) => (
            <Col md={4} key={idx}>
              <Card className="border-0 shadow-sm rounded-4 h-100 shadow-premium">
                <Card.Body className="p-4">

                  {/* ICON + TREND */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div
                      className={`bg-${stat.color} bg-opacity-10 p-3 rounded-circle text-${stat.color} fs-4`}
                    >
                      {stat.icon}
                    </div>

                    <span className="text-muted small">
                      {stat.trend}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h6 className="text-secondary fw-normal">
                    {stat.title}
                  </h6>

                  {/* VALUE */}
                  <h3 className="fw-bold mb-0">
                    {stat.value}
                  </h3>

                </Card.Body>
              </Card>
            </Col>
          ))}

        </Row>
      )}

    </div>
  );
};

export default Dashboard;