import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Kérjük, töltse ki az összes mezőt.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("A jelszónak legalább 6 karakter hosszúnak kell lennie.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("A jelszavak nem egyeznek.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Kérjük, adjon meg egy érvényes email címet.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await authAPI.register(
        formData.email,
        formData.password
      );

      setSuccess(
        "Sikeres regisztráció! Kérjük, ellenőrizze az email fiókját az aktiváláshoz."
      );

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Már létezik felhasználó ezzel az email címmel.");
      } else if (err.response?.status === 400) {
        setError("Hibás adatok. Kérjük, ellenőrizze a megadott információkat.");
      } else {
        setError("Regisztrációs hiba történt. Kérjük, próbálja újra később.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <div className="form-container">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Regisztráció</h2>
            <p className="text-center text-muted mb-4">
              Hozza létre új fiókját
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email cím</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Jelszó</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <Form.Text className="text-muted">
                  Legalább 6 karakter hosszú legyen.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Jelszó megerősítése</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Fiók létrehozása..." : "Fiók létrehozása"}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p className="mb-0">
                Már van fiókja?{" "}
                <Link to="/login" className="text-decoration-none">
                  Bejelentkezés
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Register;
