// Ez a funkció a jövőben egy valódi API hívást fog intézni
// a backend felé, hogy bejelentkeztesse a felhasználót.

export const login = async (email, password) => {
  console.log("--- AUTH SERVICE: Bejelentkezési kísérlet... ---", {
    email,
    password,
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        const isAdmin = email.toLowerCase() === "admin@admin.com";
        const userRole = isAdmin ? "admin" : "user";

        console.log(
          `--- AUTH SERVICE: Sikeres bejelentkezés. Szerepkör: ${userRole} ---`
        );

        // A javított rész: a 'userRole' változót használjuk
        const dataToReturn = {
          token: "igazi-jwt-token-a-backendrol",
          role: userRole,
        };

        console.log(
          "--- AUTH SERVICE: Visszatérési adat (resolve) ---",
          dataToReturn
        );
        resolve(dataToReturn);
      } else {
        console.log("AuthService: Sikertelen bejelentkezés (szimulált)");
        reject(new Error("Hibás e-mail cím vagy jelszó"));
      }
    }, 1000);
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

export const forgotPassword = async (email) => {
  console.log(`AuthService: Elfelejtett jelszó kérés a(z) ${email} címre...`);
  // A backend itt generálna egy egyedi, biztonságos tokent,
  // elmentené az adatbázisba egy lejárati idővel,
  // majd elküldene egy e-mailt a felhasználónak, ami tartalmazza a tokent.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.toLowerCase() === "user@example.com") {
        // Szimuláljuk, hogy ez egy regisztrált e-mail
        console.log(
          'AuthService: Jelszó-visszaállító e-mail sikeresen "elküldve".'
        );
        resolve({
          message:
            "Ha az e-mail cím regisztrálva van, elküldtük a visszaállító linket.",
        });
      } else {
        // Biztonsági okokból akkor is sikeres üzenetet küldünk, ha az e-mail nem létezik,
        // hogy ne lehessen kitalálni, mely e-mailek vannak regisztrálva.
        console.log(
          "AuthService: Nem regisztrált e-mail cím, de sikeres üzenetet küldünk."
        );
        resolve({
          message:
            "Ha az e-mail cím regisztrálva van, elküldtük a visszaállító linket.",
        });
      }
    }, 1500);
  });
};

// 2. A felhasználó az "e-mailben kapott link" után beállítja az új jelszót
export const resetPassword = async (token, newPassword) => {
  console.log(
    `AuthService: Jelszó visszaállítása a(z) "${token}" token-nel...`
  );
  // A backend itt validálná a tokent: létezik-e, nem járt-e le.
  // Ha valid, frissítené a felhasználó jelszavát a hashelt új jelszóra.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === "valid-reset-token" && newPassword) {
        // Egy ál-tokent ellenőrzünk
        console.log("AuthService: Jelszó sikeresen visszaállítva.");
        resolve({
          message:
            "A jelszavad sikeresen megváltozott! Most már bejelentkezhetsz.",
        });
      } else {
        reject(new Error("Érvénytelen vagy lejárt token."));
      }
    }, 1500);
  });
};
