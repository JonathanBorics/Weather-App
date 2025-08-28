// Ez a funkció a jövőben egy valódi API hívást fog intézni
// a backend felé, hogy bejelentkeztesse a felhasználót.

export const login = async (email, password) => {
  console.log("AuthService: Bejelentkezési kísérlet...", { email, password });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        // --- EZ AZ ÚJ LOGIKA ---
        const isAdmin = email.toLowerCase() === "admin@admin.com";
        const userRole = isAdmin ? "admin" : "user";

        console.log(
          `AuthService: Sikeres bejelentkezés (szimulált). Szerepkör: ${userRole}`
        );
        // A token mellé most már a szerepkört is visszaadjuk
        resolve({ token: "uj-felhasznalo-jwt-tokenje", role: "user" });
      } else {
        console.log("AuthService: Sikertelen bejelentkezés (szimulált)");
        reject(new Error("Hibás e-mail cím vagy jelszó"));
      }
    }, 1000); // Kicsit gyorsabb válaszidő
  });
};

export const register = async (email, password) => {
  console.log("AuthService: Regisztrációs kísérlet...", { email });

  // Szimulálunk egy hálózati késleltetést
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Itt a backend majd ellenőrizné, hogy foglalt-e az e-mail cím
      // Mi most csak azt szimuláljuk, hogy mindig sikeres, ha van adat.
      if (email && password) {
        console.log("AuthService: Sikeres regisztráció (szimulált)");
        // Sikeres regisztráció után a backend általában ugyanúgy
        // visszaad egy tokent, hogy a felhasználó egyből be is léphessen.
        resolve({ token: "uj-felhasznalo-jwt-tokenje" });
      } else {
        console.log("AuthService: Sikertelen regisztráció (szimulált)");
        reject(new Error("Minden mező kitöltése kötelező"));
      }
    }, 1500); // 1.5 másodperc késleltetés
  });
};
export const changePassword = async (currentPassword, newPassword) => {
  console.log("AuthService: Jelszóváltoztatási kísérlet...");

  // Szimulálunk egy hálózati kérést
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // A backend itt ellenőrizné, hogy a `currentPassword` helyes-e.
      // Mi most csak azt szimuláljuk, hogy ha a "régi" jelszó '123456', akkor sikeres.
      if (currentPassword === "123456" && newPassword) {
        console.log("AuthService: Sikeres jelszóváltoztatás (szimulált)");
        // Sikeres esetben általában csak egy sikeres üzenetet adunk vissza,
        // nem kell új token, mert a felhasználó be van jelentkezve.
        resolve({ message: "A jelszó sikeresen megváltozott!" });
      } else if (currentPassword !== "123456") {
        reject(new Error("A jelenlegi jelszó hibás."));
      } else {
        reject(new Error("Az új jelszó nem lehet üres."));
      }
    }, 1500); // 1.5 másodperc késleltetés
  });
};
