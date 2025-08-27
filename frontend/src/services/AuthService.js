// Ez a funkció a jövőben egy valódi API hívást fog intézni
// a backend felé, hogy bejelentkeztesse a felhasználót.

export const login = async (email, password) => {
  console.log("AuthService: Bejelentkezési kísérlet...", { email, password });

  // Szimulálunk egy 2 másodperces hálózati késleltetést
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Ellenőrizzük, hogy a felhasználó adott-e meg valamit
      // (később itt valódi ellenőrzés lesz)
      if (email && password) {
        console.log("AuthService: Sikeres bejelentkezés (szimulált)");
        // Sikeres bejelentkezés esetén visszaadunk egy ál-tokent
        resolve({ token: "igazi-jwt-token-a-backendrol" });
      } else {
        // Sikertelen bejelentkezés esetén hibát dobunk
        console.log("AuthService: Sikertelen bejelentkezés (szimulált)");
        reject(new Error("Hibás e-mail cím vagy jelszó"));
      }
    }, 2000); // 2000ms = 2 másodperc
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
