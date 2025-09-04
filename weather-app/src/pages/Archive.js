import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { weatherAPI } from "../services/api";

const Archive = () => {
  const [archiveData, setArchiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState("");

  const { cityId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (cityId) {
      fetchArchiveData();
    }
  }, [cityId, isAuthenticated, navigate]);

  const fetchArchiveData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await weatherAPI.getArchive(cityId);
      setArchiveData(response.data);

      // Ha van adat, beállítjuk a város nevét az első rekordból
      if (response.data.length > 0) {
        setCityName(response.data[0].cityName || "Ismeretlen város");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Hozzáférés megtagadva. Ez a város nincs a kedvencei között.");
      } else {
        setError("Nem sikerült betölteni az archív adatokat.");
      }
      console.error("Error fetching archive data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}.png`;
  };

  if (loading) {
    return (
      <Container style={{ marginTop: "100px" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3 text-white">Archív adatok betöltése...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "100px", paddingBottom: "50px" }}>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-white">
              Időjárás archívum
              {cityName && (
                <small className="d-block text-white-50">{cityName}</small>
              )}
            </h1>
            <Button
              variant="outline-light"
              onClick={() => navigate("/dashboard")}
            >
              Vissza a Dashboard-hoz
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

      {archiveData.length === 0 ? (
        <Row>
          <Col>
            <Card className="weather-card text-center">
              <Card.Body>
                <h5>Még nincsenek archív adatok</h5>
                <p className="text-muted">
                  Az időjárási adatok automatikusan tárolódnak, amint hozzáad
                  egy várost a kedvencekhez.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/dashboard")}
                >
                  Vissza a Dashboard-hoz
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Card className="weather-card">
              <Card.Header>
                <h5 className="mb-0">Időjárás történet</h5>
                <small className="text-muted">
                  Összesen {archiveData.length} bejegyzés
                </small>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table striped hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Dátum</th>
                        <th>Időjárás</th>
                        <th>Hőmérséklet</th>
                        <th>Leírás</th>
                        <th>Páratartalom</th>
                        <th>Szélsebesség</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archiveData.map((record, index) => (
                        <tr key={index}>
                          <td>{formatDate(record.date)}</td>
                          <td className="text-center">
                            {record.icon && (
                              <img
                                src={getWeatherIcon(record.icon)}
                                alt={record.description}
                                width="32"
                                height="32"
                              />
                            )}
                          </td>
                          <td>
                            <strong>{Math.round(record.temperature)}°C</strong>
                          </td>
                          <td style={{ textTransform: "capitalize" }}>
                            {record.description}
                          </td>
                          <td>{record.humidity}%</td>
                          <td>{record.wind_speed} m/s</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Archive;
