import React from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <i className="fas fa-cloud-sun me-2"></i>
          Weather App
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Főoldal
            </Nav.Link>

            {isAuthenticated() && (
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            )}

            {isAdmin() && (
              <Nav.Link as={Link} to="/admin">
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto">
            {!isAuthenticated() ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Bejelentkezés
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  size="sm"
                >
                  Regisztráció
                </Button>
              </>
            ) : (
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Kijelentkezés
              </Button>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
