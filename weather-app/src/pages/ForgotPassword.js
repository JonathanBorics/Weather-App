import React, { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Kérjük, adja meg az email címét.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Kérjük, adjon meg egy érvényes email címet.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await authAPI.forgotPassword(email);

      setSuccess(
        "Ha létezik fiók ezzel az email címmel, elküldtük a jelszó visszaállítási linket."
      );
      setEmail("");
    } catch (err) {
      // A backend biztonsági okokból mindig sikert jelez
      setSuccess(
        "Ha létezik fiók ezzel az email címmel, elküldtük a jelszó visszaállítási linket."
      );
      setEmail("");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "100px" }}>
      <div className="form-container">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Jelszó visszaállítás</h2>
            <p className="text-center text-muted mb-4">
              Adja meg email címét és elküldjük a visszaállítási linket
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email cím</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
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
                  {loading ? "Küldés..." : "Visszaállítási link küldése"}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p className="mb-2">
                <Link to="/login" className="text-decoration-none">
                  Vissza a bejelentkezéshez
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

export default ForgotPassword;
