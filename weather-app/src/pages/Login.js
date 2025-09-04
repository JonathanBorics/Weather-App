import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Kérjük, töltse ki az összes mezőt.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authAPI.login(formData.email, formData.password);

      login(response.data.token, response.data.role);

      // Redirect based on role
      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Helytelen email cím vagy jelszó.");
      } else if (err.response?.status === 403) {
        setError("A fiók nincs aktiválva.");
      } else {
        setError("Bejelentkezési hiba történt. Kérjük, próbálja újra.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <div className="form-container">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Bejelentkezés</h2>
            <p className="text-center text-muted mb-4">
              Jelentkezzen be a fiókjába
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

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
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Bejelentkezés..." : "Bejelentkezés"}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p className="mb-2">
                <Link to="/forgot-password" className="text-decoration-none">
                  Elfelejtette jelszavát?
                </Link>
              </p>
              <p className="mb-0">
                Nincs még fiókja?{" "}
                <Link to="/register" className="text-decoration-none">
                  Regisztráció
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
