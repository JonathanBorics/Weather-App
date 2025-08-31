// src/services/AdminService.js
import { apiClient } from "../api/client";

/**
 * Lekéri az összes felhasználót. Admin jogosultság szükséges.
 */
export const getAllUsers = async () => {
  console.log("AdminService: Összes felhasználó lekérése a szerverről...");
  try {
    // A apiClient automatikusan hozzáadja az admin tokent a header-höz.
    const response = await apiClient.get("/api/admin/users");
    // A backend `is_active` mezőt ad vissza (0 vagy 1), ezt átalakítjuk true/false-ra.
    // A jelszót a backend nem adja vissza, ami biztonságos.
    return response.data.map((user) => ({
      ...user,
      isActive: !!user.is_active, // A !! operátor 0-ból false-t, 1-ből true-t csinál.
    }));
  } catch (error) {
    console.error("Hiba a felhasználók lekérésekor:", error);
    throw error;
  }
};

/**
 * Egy felhasználó státuszának megváltoztatása (aktiválás/tiltás).
 * @param {string|number} userId A módosítandó felhasználó ID-ja.
 * @param {boolean} newStatus Az új státusz (true = aktív, false = inaktív).
 */
export const updateUserStatus = async (userId, newStatus) => {
  console.log(
    `AdminService: Státusz váltása a szerveren (ID: ${userId}, új státusz: ${newStatus})...`
  );
  try {
    // A PUT kérés body-jában küldjük az új státuszt.
    const response = await apiClient.put(`/api/admin/users/${userId}`, {
      is_active: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Hiba történt a(z) ${userId} ID-jű felhasználó státuszának frissítésekor:`,
      error
    );
    throw error;
  }
};

/**
 * Töröl egy felhasználót.
 * @param {string|number} userId A törlendő felhasználó ID-ja.
 */
export const deleteUser = async (userId) => {
  console.log(
    `AdminService: Felhasználó törlése a szerverről (ID: ${userId})...`
  );
  try {
    const response = await apiClient.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Hiba történt a(z) ${userId} ID-jű felhasználó törlésekor:`,
      error
    );
    throw error;
  }
};

/**
 * Lekéri a városok népszerűségi statisztikáját.
 */
export const getPopularityStats = async () => {
  console.log(
    "AdminService: Népszerűségi statisztikák lekérése a szerverről..."
  );
  try {
    const response = await apiClient.get("/api/admin/stats/popularity");

    // --- JAVÍTÁS ITT: Adat-átalakítás és -átnevezés ---
    // A backend 'favorite_count'-ot küld, de a komponens 'popularity'-t vár.
    // Itt a service rétegben végezzük el a "fordítást".
    const stats = response.data.map((item) => ({
      id: item.id.toString(), // Biztosítjuk, hogy az ID string legyen
      cityName: item.name, // A 'name' mezőt átnevezzük 'cityName'-re a konzisztencia kedvéért
      popularity: parseInt(item.favorite_count, 10), // A 'favorite_count'-ot átnevezzük és számmá alakítjuk
    }));

    // Opcionális: Számítsuk ki a maximumot, hogy a progress bar relatív legyen
    const maxPopularity = Math.max(...stats.map((s) => s.popularity), 1); // A Math.max(...[], 1) = 1, így elkerüljük a 0-val való osztást

    // Adjunk hozzá egy 'progress' mezőt is
    const statsWithProgress = stats.map((item) => ({
      ...item,
      progress: item.popularity / maxPopularity,
    }));

    return statsWithProgress;
  } catch (error) {
    console.error("Hiba a statisztikák lekérésekor:", error);
    throw error;
  }
};

// Átneveztem a toggleUserStatus-t updateUserStatus-ra, mert a komponensed valószínűleg
// már tudja, mi legyen az új állapot, és azt küldi el, nem csak egy "váltás" jelzést.
// Ha mégis a "váltás" logikát szeretnéd, használhatod ezt a segédfüggvényt
// a komponensedben, mielőtt meghívod az updateUserStatus-t.
