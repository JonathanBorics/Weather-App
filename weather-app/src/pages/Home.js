import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { weatherAPI } from "../services/api";

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGuestWeather();
  }, []);

  const fetchGuestWeather = async () => {
    try {
      setLoading(true);
      const response = await weatherAPI.getGuestWeather();
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setError("Nem sikerült betölteni az időjárási adatokat.");
      console.error("Error fetching guest weather:", err);
    } finally {
      setLoading(false);
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
          <p className="mt-3 text-white">Időjárási adatok betöltése...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "100px", paddingBottom: "50px" }}>
      <Row className="text-center mb-5">
        <Col>
          <h1 className="text-white mb-3">Időjárás Alkalmazás</h1>
          <p className="text-white-50">
            Tekintse meg a világ nagyvárosainak aktuális időjárását
          </p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        {weatherData.map((city, index) => (
          <Col key={index} xs={12} sm={6} lg={4} xl={3} className="mb-4">
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
                  className="text-muted mb-0"
                  style={{ textTransform: "capitalize" }}
                >
                  {city.description}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      
    </Container>
  );
};

export default Home;
