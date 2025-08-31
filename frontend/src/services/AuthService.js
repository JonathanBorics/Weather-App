// src/services/AuthService.js
import { apiClient } from "../api/client"; // Beimportáljuk a központi, beállított API kliensünket

/**
 * Bejelentkezteti a felhasználót a backend API hívásával.
 * @param {string} email A felhasználó e-mail címe.
 * @param {string} password A felhasználó jelszava.
 * @returns {Promise<object>} Egy Promise, ami sikeres esetben a { token, role } objektumot adja vissza.
 */
export const login = async (email, password) => {
  try {
    // A setTimeout helyett most már egy valódi hálózati kérést küldünk.
    // Az apiClient.post metódus a háttérben az axios-t használja.
    // Az URL relatív, mert a baseURL-t a client.js-ben már beállítottuk.
    const response = await apiClient.post("/api/auth/login", {
      email: email,
      password: password,
    });

    // Az axios a választ a 'data' tulajdonságban adja vissza.
    // Ha a kérés sikeres (státusz 2xx), a response.data a mi
    // { token, role } objektumunk lesz.
    return response.data;
  } catch (error) {
    // Ha a backend 4xx vagy 5xx státuszkóddal válaszol (pl. hibás jelszó),
    // az axios hibát dob. A backend által küldött hibaüzenet
    // az error.response.data objektumban lesz.
    if (error.response && error.response.data) {
      // Dobjuk tovább a backend hibaüzenetét, hogy a képernyőn meg tudjuk jeleníteni.
      throw new Error(error.response.data.error || "Ismeretlen hiba történt");
    }
    // Ha hálózati hiba van, dobjunk egy általánosabb üzenetet.
    throw new Error("Szerver hiba vagy nincs internetkapcsolat.");
  }
};

/**
 * Regisztrál egy új felhasználót.
 */
export const register = async (email, password) => {
  try {
    const response = await apiClient.post("/api/auth/register", {
      email,
      password,
    });
    return response.data; // Sikeres esetben a backend visszaadja a tokent és a szerepkört
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Regisztrációs hiba");
    }
    throw new Error("Szerver hiba vagy nincs internetkapcsolat.");
  }
};

/**
 * Elfelejtett jelszó folyamat elindítása.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post("/api/auth/forgot-password", {
      email,
    });
    return response.data; // Visszaadja a sikeres üzenetet
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Hiba történt");
    }
    throw new Error("Szerver hiba vagy nincs internetkapcsolat.");
  }
};

/**
 * Új jelszó beállítása a kapott token segítségével.
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await apiClient.post("/api/auth/reset-password", {
      token,
      password,
    });
    return response.data; // Visszaadja a sikeres üzenetet
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Érvénytelen token vagy hiba"
      );
    }
    throw new Error("Szerver hiba vagy nincs internetkapcsolat.");
  }
};
