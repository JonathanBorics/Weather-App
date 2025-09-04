import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { weatherAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await weatherAPI.getFavorites();
      setFavorites(response.data);
      setError("");
    } catch (err) {
      setError("Nem sikerült betölteni a kedvenc városokat.");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCityName.trim()) {
      return;
    }

    try {
      setAddingCity(true);
      setError("");

      await weatherAPI.addFavorite(newCityName.trim());

      setSuccess("Város sikeresen hozzáadva!");
      setNewCityName("");
      setShowAddModal(false);

      // Refresh the favorites list
      fetchFavorites();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Város nem található.");
      } else if (err.response?.status === 409) {
        setError("Ez a város már hozzá van adva a kedvencekhez.");
      } else {
        setError("Hiba történt a város hozzáadása során.");
      }
      console.error("Error adding city:", err);
    } finally {
      setAddingCity(false);
    }
  };

  const handleRemoveCity = async (cityId) => {
    if (
      !window.confirm(
        "Biztosan törölni szeretné ezt a várost a kedvencek közül?"
      )
    ) {
      return;
    }

    try {
      await weatherAPI.deleteFavorite(cityId);
      setSuccess("Város sikeresen törölve!");

      // Remove from local state
      setFavorites(favorites.filter((city) => city.id !== cityId));

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Hiba történt a város törlése során.");
      console.error("Error removing city:", err);
    }
  };

  const getWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  if (loading) {
    return (
      <Container style={{ marginTop: "100px" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3 text-white">Kedvenc városok betöltése...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "100px", paddingBottom: "50px" }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-white">Dashboard</h1>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              + Város hozzáadása
            </Button>
          </div>
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

      {favorites.length === 0 ? (
        <Row>
          <Col>
            <Card className="weather-card text-center">
              <Card.Body>
                <h5>Még nincsenek kedvenc városai</h5>
                <p className="text-muted">
                  Adja hozzá első kedvenc városát az időjárás követéséhez.
                </p>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  Város hozzáadása
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {favorites.map((city) => (
            <Col key={city.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
              <Card className="weather-card h-100">
                <Card.Body className="text-center">
                  <Card.Title className="mb-3">
                    {city.cityName}
                    <small className="text-muted d-block">{city.country}</small>
                  </Card.Title>

                  <div className="mb-3">
                    <img
                      src={getWeatherIcon(city.icon)}
                      alt={city.description}
                      className="weather-icon"
                    />
                  </div>

                  <h2 className="text-primary mb-2">
                    {Math.round(city.temperature)}°C
                  </h2>

                  <p
                    className="text-muted mb-3"
                    style={{ textTransform: "capitalize" }}
                  >
                    {city.description}
                  </p>

                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/archive/${city.id}`)}
                    >
                      Archívum
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveCity(city.id)}
                    >
                      Törlés
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add City Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Új város hozzáadása</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddCity}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Város neve</Form.Label>
              <Form.Control
                type="text"
                placeholder="pl. Budapest"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Mégse
            </Button>
            <Button type="submit" variant="primary" disabled={addingCity}>
              {addingCity ? "Hozzáadás..." : "Hozzáadás"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Dashboard;
