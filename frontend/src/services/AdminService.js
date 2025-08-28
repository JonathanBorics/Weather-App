import apiClient from "../api/client";

// Egy változó, ami a memóriában tárolja a felhasználók listáját,
// hogy a módosításokat (tiltás, törlés) szimulálni tudjuk.
let inMemoryUsers = [];

// Lekéri az összes felhasználót (szimulált)
export const getAllUsers = async () => {
  console.log("AdminService: Összes felhasználó lekérése...");
  try {
    // Csak akkor hívjuk az API-t, ha a memóriában lévő lista még üres
    if (inMemoryUsers.length === 0) {
      const response = await apiClient.get("/users");
      // Átalakítjuk az adatokat, és hozzáadunk egy 'isActive' állapotot
      inMemoryUsers = response.data.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email.toLowerCase(),
        isActive: user.id % 3 !== 0, // Szimuláljuk, hogy minden 3. felhasználó inaktív
      }));
      console.log("AdminService: Felhasználók letöltve az API-ról.");
    } else {
      console.log("AdminService: Felhasználók a memóriából szolgáltatva.");
    }
    return [...inMemoryUsers]; // Mindig a tömb másolatát adjuk vissza
  } catch (error) {
    console.error("Hiba a felhasználók lekérésekor:", error);
    throw error;
  }
};

// Egy felhasználó státuszának megváltoztatása (tiltás/engedélyezés)
export const toggleUserStatus = async (userId) => {
  console.log(`AdminService: Státusz váltása (ID: ${userId})...`);
  // A jövőben itt egy PUT kérés lesz: await apiClient.put(`/api/admin/users/${userId}/status`);
  return new Promise((resolve) => {
    setTimeout(() => {
      inMemoryUsers = inMemoryUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      );
      console.log("AdminService: Státusz sikeresen megváltoztatva.");
      resolve({ success: true });
    }, 500);
  });
};

// Egy felhasználó törlése
export const deleteUser = async (userId) => {
  console.log(`AdminService: Felhasználó törlése (ID: ${userId})...`);
  // A jövőben itt egy DELETE kérés lesz: await apiClient.delete(`/api/admin/users/${userId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      inMemoryUsers = inMemoryUsers.filter((user) => user.id !== userId);
      console.log("AdminService: Felhasználó sikeresen törölve.");
      resolve({ success: true });
    }, 500);
  });
};

export const getPopularityStats = async () => {
  console.log("AdminService: Népszerűségi statisztikák lekérése...");
  // A valóságban ez egy komplexebb backend lekérdezés lenne.
  // Mi most a JSONPlaceholder 'todos' végpontját használjuk,
  // és úgy teszünk, mintha a 'title' lenne a városnév,
  // a 'userId' pedig a népszerűségi pontszám.
  try {
    const response = await apiClient.get("/todos?_limit=10"); // Lekérünk 10 "statisztikát"

    const statsData = response.data.map((item) => ({
      id: item.id.toString(),
      cityName: item.title.split(" ")[0], // A teendő első szava lesz a városnév
      popularity: item.userId * 10, // A userId-t megszorozzuk, hogy nagyobb szám legyen
    }));

    // Rendezés népszerűség szerint csökkenő sorrendbe
    statsData.sort((a, b) => b.popularity - a.popularity);

    console.log("AdminService: Statisztikák sikeresen lekérve.");
    return statsData;
  } catch (error) {
    console.error("Hiba a statisztikák lekérésekor:", error);
    throw error;
  }
};
