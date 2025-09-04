import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Badge,
  Form,
  InputGroup,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { adminAPI } from "../services/api";

const DeviceSessionsManager = () => {
  const [sessions, setSessions] = useState([]);
  const [deviceStats, setDeviceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDevice, setFilterDevice] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [sortField, setSortField] = useState("last_activity");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Modal
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setError("");

      // Valós API hívások
      const [sessionsResponse, statsResponse] = await Promise.all([
        adminAPI.getDeviceSessions(),
        adminAPI.getDeviceStats(),
      ]);

      setSessions(sessionsResponse.data);
      setDeviceStats(statsResponse.data);
    } catch (err) {
      // Ha nem működik az API, használjunk mock adatokat
      console.warn("API not available, using mock data:", err);

      const mockSessions = [
        // ... mock adatok ...
      ];

      const mockStats = {
        // ... mock stats ...
      };

      setSessions(mockSessions);
      setDeviceStats(mockStats);

      setError("Device API nem elérhető, mock adatok használata.");
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      !searchTerm ||
      session.ip_address.includes(searchTerm) ||
      (session.user_email &&
        session.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      session.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.browser_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDevice = !filterDevice || session.device_type === filterDevice;
    const matchesCountry = !filterCountry || session.country === filterCountry;

    return matchesSearch && matchesDevice && matchesCountry;
  });

  // Sorting
  const sortedSessions = [...filteredSessions].sort((a, b) => {
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

  // Pagination
  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const currentSessions = sortedSessions.slice(
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

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("hu-HU");
  };

  const getDeviceColor = (deviceType) => {
    const colors = {
      desktop: "primary",
      mobile: "success",
      tablet: "warning",
    };
    return colors[deviceType] || "secondary";
  };

  const exportData = () => {
    const csvData = [
      [
        "Session ID",
        "User",
        "IP",
        "Device",
        "Browser",
        "Country",
        "City",
        "Last Activity",
        "Duration",
        "Page Views",
      ].join(","),
      ...sortedSessions.map((session) =>
        [
          session.session_id,
          session.user_email || "Guest",
          session.ip_address,
          session.device_type,
          `${session.browser_name} ${session.browser_version}`,
          session.country,
          session.city,
          formatDate(session.last_activity),
          formatDuration(session.session_duration),
          session.page_views,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "device_sessions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p className="mt-3">Eszköz adatok betöltése...</p>
      </div>
    );
  }

  return (
    <>
      {/* Statistics Cards */}
      {deviceStats && (
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <h6 className="text-muted">Eszköz típusok</h6>
                {deviceStats.deviceTypes.map((stat) => (
                  <div
                    key={stat.device_type}
                    className="d-flex justify-content-between"
                  >
                    <span className="text-capitalize">{stat.device_type}:</span>
                    <Badge bg={getDeviceColor(stat.device_type)}>
                      {stat.count}
                    </Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <h6 className="text-muted">Top országok</h6>
                {deviceStats.countries.slice(0, 3).map((stat) => (
                  <div
                    key={stat.country}
                    className="d-flex justify-content-between"
                  >
                    <span>{stat.country}:</span>
                    <Badge bg="info">{stat.sessions}</Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card>
              <Card.Body>
                <h6 className="text-muted">Böngészők</h6>
                {deviceStats.browsers.slice(0, 3).map((stat) => (
                  <div
                    key={stat.browser_name}
                    className="d-flex justify-content-between"
                  >
                    <span>{stat.browser_name}:</span>
                    <Badge bg="secondary">{stat.count}</Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters and Controls */}
      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col md={3}>
              <h5 className="mb-0">Aktív Sessions ({sortedSessions.length})</h5>
            </Col>
            <Col md={3}>
              <InputGroup size="sm">
                <Form.Control
                  type="text"
                  placeholder="Keresés..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={filterDevice}
                onChange={(e) => setFilterDevice(e.target.value)}
              >
                <option value="">Minden eszköz</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                size="sm"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="">Minden ország</option>
                <option value="Hungary">Hungary</option>
                <option value="Romania">Romania</option>
                <option value="Serbia">Serbia</option>
              </Form.Select>
            </Col>
            <Col md={2} className="text-end">
              <Button variant="outline-success" size="sm" onClick={exportData}>
                Export CSV
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("user_email")}
                  >
                    Felhasználó{" "}
                    {sortField === "user_email" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("ip_address")}
                  >
                    IP{" "}
                    {sortField === "ip_address" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("device_type")}
                  >
                    Eszköz{" "}
                    {sortField === "device_type" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th>Böngésző</th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("country")}
                  >
                    Hely{" "}
                    {sortField === "country" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("last_activity")}
                  >
                    Utolsó aktivitás{" "}
                    {sortField === "last_activity" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th>Időtartam</th>
                  <th>Oldalak</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {currentSessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      {session.user_email ? (
                        <span className="text-success">
                          {session.user_email}
                        </span>
                      ) : (
                        <Badge bg="secondary">Vendég</Badge>
                      )}
                    </td>
                    <td>
                      <code className="small">{session.ip_address}</code>
                    </td>
                    <td>
                      <Badge bg={getDeviceColor(session.device_type)}>
                        {session.device_type}
                      </Badge>
                    </td>
                    <td>
                      {session.browser_name} {session.browser_version}
                    </td>
                    <td>
                      <small>
                        {session.country}, {session.city}
                      </small>
                    </td>
                    <td>
                      <small>{formatDate(session.last_activity)}</small>
                    </td>
                    <td>
                      <small>{formatDuration(session.session_duration)}</small>
                    </td>
                    <td>
                      <Badge bg="info">{session.page_views}</Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setSelectedSession(session);
                          setShowModal(true);
                        }}
                      >
                        Részletek
                      </Button>
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
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                style={{ width: "auto" }}
              >
                <option value={10}>10 / oldal</option>
                <option value={25}>25 / oldal</option>
                <option value={50}>50 / oldal</option>
                <option value={100}>100 / oldal</option>
              </Form.Select>
            </div>

            <div>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
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
                {sortedSessions.length} session összesen
              </small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Session Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Session Részletek</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <div className="row">
              <div className="col-md-6">
                <h6>Alap információk</h6>
                <p>
                  <strong>Session ID:</strong>{" "}
                  <code>{selectedSession.session_id}</code>
                </p>
                <p>
                  <strong>IP cím:</strong> {selectedSession.ip_address}
                </p>
                <p>
                  <strong>User Agent:</strong>
                  <br />
                  <small>{selectedSession.user_agent}</small>
                </p>
              </div>
              <div className="col-md-6">
                <h6>Eszköz adatok</h6>
                <p>
                  <strong>Eszköz típus:</strong>{" "}
                  <Badge bg={getDeviceColor(selectedSession.device_type)}>
                    {selectedSession.device_type}
                  </Badge>
                </p>
                <p>
                  <strong>Böngésző:</strong> {selectedSession.browser_name}{" "}
                  {selectedSession.browser_version}
                </p>
                <p>
                  <strong>Platform:</strong> {selectedSession.platform}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Helyszín</h6>
                <p>
                  <strong>Ország:</strong> {selectedSession.country}
                </p>
                <p>
                  <strong>Város:</strong> {selectedSession.city}
                </p>
              </div>
              <div className="col-md-6">
                <h6>Aktivitás</h6>
                <p>
                  <strong>Első látogatás:</strong>{" "}
                  {formatDate(selectedSession.first_seen)}
                </p>
                <p>
                  <strong>Utolsó aktivitás:</strong>{" "}
                  {formatDate(selectedSession.last_activity)}
                </p>
                <p>
                  <strong>Időtartam:</strong>{" "}
                  {formatDuration(selectedSession.session_duration)}
                </p>
                <p>
                  <strong>Oldalmegtekintések:</strong>{" "}
                  {selectedSession.page_views}
                </p>
                <p>
                  <strong>Műveletek:</strong> {selectedSession.actions_count}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Bezár
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeviceSessionsManager;
