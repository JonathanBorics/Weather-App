import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Hiányzó vagy érvénytelen token.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await authAPI.resetPassword(token, formData.password);

      setSuccess(
        "Jelszó sikeresen megváltoztatva! Átirányítás a bejelentkezési oldalra..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Érvénytelen token.");
      } else if (err.response?.status === 410) {
        setError(
          "A token lejárt. Kérjük, igényeljen új jelszó visszaállítást."
        );
      } else {
        setError("Hiba történt a jelszó megváltoztatása során.");
      }
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <Container style={{ marginTop: "100px" }}>
        <div className="text-center text-white">
          <p>Token betöltése...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "100px" }}>
      <div className="form-container">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Jelszó visszaállítás</h2>
            <p className="text-center text-muted mb-4">Adja meg új jelszavát</p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {token && !success && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Új jelszó</Form.Label>
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
                    {loading ? "Jelszó mentése..." : "Jelszó megváltoztatása"}
                  </Button>
                </div>
              </Form>
            )}

            <div className="text-center mt-4">
              <Link to="/login" className="text-decoration-none">
                Vissza a bejelentkezéshez
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ResetPassword;
