import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [popularityStats, setPopularityStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deviceStats, setDeviceStats] = useState([]);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate("/");
      return;
    }
    fetchData();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, statsResponse] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getPopularityStats(),
      ]);

      setUsers(usersResponse.data);
      setPopularityStats(statsResponse.data);

      // Device stats lekérése (ha van ilyen endpoint)
      try {
        const deviceResponse = await adminAPI.getDeviceStats();

        setDeviceStats(deviceResponse.data);
      } catch (err) {
        console.warn("Device stats not available:", err);
      }
    } catch (err) {
      setError("Nem sikerült betölteni az admin adatokat.");
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminAPI.updateUserStatus(userId, newStatus);

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_active: newStatus ? 1 : 0 } : user
        )
      );

      setSuccess(
        `Felhasználó státusza sikeresen ${
          newStatus ? "aktiválva" : "deaktiválva"
        }.`
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Hiba történt a felhasználó státuszának módosításakor.");
      console.error("Error updating user status:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Biztosan törölni szeretné ezt a felhasználót? Ez a művelet nem vonható vissza."
      )
    ) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);

      setUsers(users.filter((user) => user.id !== userId));
      setSuccess("Felhasználó sikeresen törölve.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Hiba történt a felhasználó törlésekor.");
      console.error("Error deleting user:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container style={{ marginTop: "100px" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3 text-white">Admin adatok betöltése...</p>
        </div>
      </Container>
    );
  }

  return (
    <div
      className="admin-panel"
      style={{ marginTop: "80px", minHeight: "calc(100vh - 80px)" }}
    >
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1>Admin Panel</h1>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {success && (
          <Row className="mb-4">
            <Col>
              <Alert variant="success">{success}</Alert>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Felhasználók kezelése</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Szerepkör</th>
                        <th>Státusz</th>
                        <th>Regisztráció</th>
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge
                              bg={user.role === "admin" ? "danger" : "primary"}
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              bg={user.is_active ? "success" : "secondary"}
                            >
                              {user.is_active ? "Aktív" : "Inaktív"}
                            </Badge>
                          </td>
                          <td>{formatDate(user.created_at)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {user.role !== "admin" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant={
                                      user.is_active ? "warning" : "success"
                                    }
                                    onClick={() =>
                                      handleToggleUserStatus(
                                        user.id,
                                        user.is_active
                                      )
                                    }
                                  >
                                    {user.is_active
                                      ? "Deaktiválás"
                                      : "Aktiválás"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Törlés
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Városok népszerűsége</h5>
              </Card.Header>
              <Card.Body>
                {popularityStats.length === 0 ? (
                  <p className="text-muted">Még nincsenek adatok.</p>
                ) : (
                  <div className="table-responsive">
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Város</th>
                          <th>Ország</th>
                          <th>Kedvelők</th>
                        </tr>
                      </thead>
                      <tbody>
                        {popularityStats.slice(0, 10).map((city, index) => (
                          <tr key={city.id}>
                            <td>{city.name}</td>
                            <td>{city.country}</td>
                            <td>
                              <Badge bg="info">{city.favorite_count}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPanel;
