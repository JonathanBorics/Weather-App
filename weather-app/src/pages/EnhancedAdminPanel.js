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
  Tab,
  Tabs,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import DeviceAnalytics from "../components/DeviceAnalytics";
import DeviceSessionsManager from "../components/DeviceSessionsManager";

const EnhancedAdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [popularityStats, setPopularityStats] = useState([]);
  const [deviceStats, setDeviceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // DataTables-like functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

      // Device stats lekérése (opcionális)
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

  // DataTables funkcionalitás
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = (format) => {
    if (format === "csv") {
      exportToCSV();
    } else if (format === "json") {
      exportToJSON();
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Email", "Role", "Status", "Created At"];
    const csvData = [
      headers.join(","),
      ...sortedUsers.map((user) =>
        [
          user.id,
          user.email,
          user.role,
          user.is_active ? "Active" : "Inactive",
          formatDate(user.created_at),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonData = JSON.stringify(sortedUsers, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.json";
    a.click();
    window.URL.revokeObjectURL(url);
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
            <h1>Fejlett Admin Panel</h1>
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

        <Tabs defaultActiveKey="users" id="admin-tabs" className="mb-4">
          <Tab eventKey="users" title="Felhasználók kezelése">
            <Card>
              <Card.Header>
                <Row className="align-items-center">
                  <Col md={4}>
                    <h5 className="mb-0">
                      Felhasználók ({sortedUsers.length})
                    </h5>
                  </Col>
                  <Col md={4}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Keresés..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleExport("csv")}
                      className="me-2"
                    >
                      CSV Export
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleExport("json")}
                    >
                      JSON Export
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead>
                      <tr>
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSort("id")}
                        >
                          ID{" "}
                          {sortField === "id" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSort("email")}
                        >
                          Email{" "}
                          {sortField === "email" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSort("role")}
                        >
                          Szerepkör{" "}
                          {sortField === "role" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSort("is_active")}
                        >
                          Státusz{" "}
                          {sortField === "is_active" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSort("created_at")}
                        >
                          Regisztráció{" "}
                          {sortField === "created_at" &&
                            (sortDirection === "asc" ? "▲" : "▼")}
                        </th>
                        <th>Műveletek</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
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
                            <div className="d-flex gap-1">
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
                                    {user.is_active ? "Deakt." : "Akt."}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Töröl
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

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3">
                  <div>
                    <Form.Select
                      size="sm"
                      value={itemsPerPage}
                      onChange={(e) =>
                        setItemsPerPage(parseInt(e.target.value))
                      }
                      style={{ width: "auto" }}
                    >
                      <option value={5}>5 / oldal</option>
                      <option value={10}>10 / oldal</option>
                      <option value={25}>25 / oldal</option>
                      <option value={50}>50 / oldal</option>
                    </Form.Select>
                  </div>

                  <div>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        size="sm"
                        variant={
                          currentPage === i + 1 ? "primary" : "outline-primary"
                        }
                        onClick={() => setCurrentPage(i + 1)}
                        className="me-1"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>

                  <div>
                    <small className="text-muted">
                      {sortedUsers.length} felhasználó összesen
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="stats" title="Statisztikák">
            <Row>
              <Col lg={6} className="mb-4">
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
                              <th>#</th>
                              <th>Város</th>
                              <th>Ország</th>
                              <th>Kedvelők</th>
                            </tr>
                          </thead>
                          <tbody>
                            {popularityStats.slice(0, 10).map((city, index) => (
                              <tr key={city.id}>
                                <td>{index + 1}</td>
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

              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Rendszer statisztikák</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <h4 className="text-primary">{users.length}</h4>
                        <small>Összes felhasználó</small>
                      </div>
                      <div className="col-6 mb-3">
                        <h4 className="text-success">
                          {users.filter((u) => u.is_active).length}
                        </h4>
                        <small>Aktív felhasználó</small>
                      </div>
                      <div className="col-6">
                        <h4 className="text-warning">
                          {popularityStats.length}
                        </h4>
                        <small>Követett város</small>
                      </div>
                      <div className="col-6">
                        <h4 className="text-info">
                          {users.filter((u) => u.role === "admin").length}
                        </h4>
                        <small>Admin</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="devices" title="Eszközök">
            <DeviceSessionsManager />
          </Tab>

          <Tab eventKey="analytics" title="Device Analytics">
            <DeviceAnalytics />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default EnhancedAdminPanel;
