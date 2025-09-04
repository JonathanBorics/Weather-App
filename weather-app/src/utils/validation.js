// // ===============================
// //  EMAIL VALIDÁCIÓ
// // ===============================

// export const validateEmail = (email) => {
//   const errors = [];

//   if (!email || !email.trim()) {
//     errors.push("Email cím megadása kötelező");
//     return errors;
//   }

//   const emailTrimmed = email.trim();

//   // Alapvető email formátum ellenőrzés
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(emailTrimmed)) {
//     errors.push("Érvényes email címet adjon meg");
//   }

//   // Email hossz ellenőrzés
//   if (emailTrimmed.length > 254) {
//     errors.push("Az email cím túl hosszú (maximum 254 karakter)");
//   }

//   // Speciális karakterek ellenőrzése
//   if (emailTrimmed.includes("..")) {
//     errors.push("Az email cím nem tartalmazhat egymás utáni pontokat");
//   }

//   return errors;
// };

// // ===============================
// //  JELSZÓ VALIDÁCIÓ
// // ===============================

// export const validatePassword = (password, options = {}) => {
//   const {
//     minLength = 6,
//     maxLength = 128,
//     requireUppercase = false,
//     requireLowercase = false,
//     requireNumbers = false,
//     requireSpecialChars = false,
//   } = options;

//   const errors = [];

//   if (!password) {
//     errors.push("Jelszó megadása kötelező");
//     return errors;
//   }

//   // Hosszúság ellenőrzés
//   if (password.length < minLength) {
//     errors.push(
//       `A jelszónak legalább ${minLength} karakter hosszúnak kell lennie`
//     );
//   }

//   if (password.length > maxLength) {
//     errors.push(`A jelszó nem lehet hosszabb ${maxLength} karakternél`);
//   }

//   // Nagybetű ellenőrzés
//   if (requireUppercase && !/[A-Z]/.test(password)) {
//     errors.push("A jelszónak tartalmaznia kell legalább egy nagybetűt");
//   }

//   // Kisbetű ellenőrzés
//   if (requireLowercase && !/[a-z]/.test(password)) {
//     errors.push("A jelszónak tartalmaznia kell legalább egy kisbetűt");
//   }

//   // Szám ellenőrzés
//   if (requireNumbers && !/\d/.test(password)) {
//     errors.push("A jelszónak tartalmaznia kell legalább egy számot");
//   }

//   // Speciális karakter ellenőrzés
//   if (
//     requireSpecialChars &&
//     !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
//   ) {
//     errors.push(
//       "A jelszónak tartalmaznia kell legalább egy speciális karaktert"
//     );
//   }

//   return errors;
// };

// // Jelszó erősség ellenőrzés (0-4 skálán)
// export const getPasswordStrength = (password) => {
//   if (!password) return 0;

//   let strength = 0;

//   // Alapvető hossz
//   if (password.length >= 6) strength++;
//   if (password.length >= 8) strength++;

//   // Karakter típusok
//   if (/[a-z]/.test(password)) strength++;
//   if (/[A-Z]/.test(password)) strength++;
//   if (/\d/.test(password)) strength++;
//   if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

//   return Math.min(strength, 4);
// };

// export const getPasswordStrengthText = (strength) => {
//   const texts = {
//     0: "Nagyon gyenge",
//     1: "Gyenge",
//     2: "Közepes",
//     3: "Erős",
//     4: "Nagyon erős",
//   };
//   return texts[strength] || "Ismeretlen";
// };

// // ===============================
// //  JELSZÓ EGYEZÉS VALIDÁCIÓ
// // ===============================

// export const validatePasswordConfirmation = (password, confirmPassword) => {
//   const errors = [];

//   if (!confirmPassword) {
//     errors.push("Jelszó megerősítése kötelező");
//     return errors;
//   }

//   if (password !== confirmPassword) {
//     errors.push("A jelszavak nem egyeznek");
//   }

//   return errors;
// };

// // ===============================
// //  VÁROSNÉV VALIDÁCIÓ
// // ===============================

// export const validateCityName = (cityName) => {
//   const errors = [];

//   if (!cityName || !cityName.trim()) {
//     errors.push("Városnév megadása kötelező");
//     return errors;
//   }

//   const cityTrimmed = cityName.trim();

//   // Hosszúság ellenőrzés
//   if (cityTrimmed.length < 2) {
//     errors.push("A városnévnek legalább 2 karakter hosszúnak kell lennie");
//   }

//   if (cityTrimmed.length > 100) {
//     errors.push("A városnév túl hosszú (maximum 100 karakter)");
//   }

//   // Érvényes karakterek (betűk, szóközök, kötőjelek, aposztrofok)
//   const validCityRegex =
//     /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s\-'.,()]+$/;
//   if (!validCityRegex.test(cityTrimmed)) {
//     errors.push("A városnév érvénytelen karaktereket tartalmaz");
//   }

//   return errors;
// };

// // ===============================
// //  DÁTUM VALIDÁCIÓ
// // ===============================

// export const validateDate = (dateString, options = {}) => {
//   const {
//     required = false,
//     minDate = null,
//     maxDate = null,
//     futureAllowed = true,
//     pastAllowed = true,
//   } = options;

//   const errors = [];

//   if (!dateString || !dateString.trim()) {
//     if (required) {
//       errors.push("Dátum megadása kötelező");
//     }
//     return errors;
//   }

//   // Dátum formátum ellenőrzés
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) {
//     errors.push("Érvényes dátumot adjon meg");
//     return errors;
//   }

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Jövőbeli dátum ellenőrzés
//   if (!futureAllowed && date > today) {
//     errors.push("Jövőbeli dátum nem engedélyezett");
//   }

//   // Múltbeli dátum ellenőrzés
//   if (!pastAllowed && date < today) {
//     errors.push("Múltbeli dátum nem engedélyezett");
//   }

//   // Minimum dátum ellenőrzés
//   if (minDate && date < new Date(minDate)) {
//     errors.push(`A dátum nem lehet korábbi, mint ${minDate}`);
//   }

//   // Maximum dátum ellenőrzés
//   if (maxDate && date > new Date(maxDate)) {
//     errors.push(`A dátum nem lehet későbbi, mint ${maxDate}`);
//   }

//   return errors;
// };

// // ===============================
// //  SZÁM VALIDÁCIÓ
// // ===============================

// export const validateNumber = (value, options = {}) => {
//   const {
//     required = false,
//     min = null,
//     max = null,
//     integer = false,
//     positive = false,
//   } = options;

//   const errors = [];

//   if (value === "" || value === null || value === undefined) {
//     if (required) {
//       errors.push("Érték megadása kötelező");
//     }
//     return errors;
//   }

//   const num = parseFloat(value);

//   // Szám formátum ellenőrzés
//   if (isNaN(num)) {
//     errors.push("Érvényes számot adjon meg");
//     return errors;
//   }

//   // Egész szám ellenőrzés
//   if (integer && !Number.isInteger(num)) {
//     errors.push("Egész számot adjon meg");
//   }

//   // Pozitív szám ellenőrzés
//   if (positive && num <= 0) {
//     errors.push("Pozitív számot adjon meg");
//   }

//   // Minimum érték ellenőrzés
//   if (min !== null && num < min) {
//     errors.push(`Az érték nem lehet kisebb, mint ${min}`);
//   }

//   // Maximum érték ellenőrzés
//   if (max !== null && num > max) {
//     errors.push(`Az érték nem lehet nagyobb, mint ${max}`);
//   }

//   return errors;
// };

// // ===============================
// //  FORM VALIDÁCIÓ HELPER
// // ===============================

// export const validateForm = (formData, validationRules) => {
//   const errors = {};
//   let isValid = true;

//   Object.keys(validationRules).forEach((fieldName) => {
//     const rules = validationRules[fieldName];
//     const value = formData[fieldName];
//     const fieldErrors = [];

//     // Minden szabály végrehajtása
//     rules.forEach((rule) => {
//       if (typeof rule === "function") {
//         const ruleErrors = rule(value, formData);
//         fieldErrors.push(...ruleErrors);
//       }
//     });

//     if (fieldErrors.length > 0) {
//       errors[fieldName] = fieldErrors[0]; // Csak az első hibát jelenítjük meg
//       isValid = false;
//     }
//   });

//   return { errors, isValid };
// };

// // ===============================
// //  ELŐRE DEFINIÁLT VALIDÁCIÓS SZABÁLYOK
// // ===============================

// export const validationRules = {
//   // Regisztráció
//   registration: {
//     email: [(value) => validateEmail(value)],
//     password: [(value) => validatePassword(value, { minLength: 6 })],
//     confirmPassword: [
//       (value, formData) =>
//         validatePasswordConfirmation(formData.password, value),
//     ],
//   },

//   // Bejelentkezés
//   login: {
//     email: [(value) => validateEmail(value)],
//     password: [(value) => (value ? [] : ["Jelszó megadása kötelező"])],
//   },

//   // Város hozzáadás
//   addCity: {
//     cityName: [(value) => validateCityName(value)],
//   },

//   // Archív szűrés
//   archiveFilter: {
//     dateFrom: [
//       (value) => validateDate(value, { required: false, futureAllowed: false }),
//     ],
//     dateTo: [
//       (value) => validateDate(value, { required: false, futureAllowed: false }),
//     ],
//     tempMin: [
//       (value) => validateNumber(value, { required: false, min: -50, max: 50 }),
//     ],
//     tempMax: [
//       (value) => validateNumber(value, { required: false, min: -50, max: 50 }),
//     ],
//   },
// };
