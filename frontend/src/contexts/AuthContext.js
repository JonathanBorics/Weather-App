import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null); // <-- ÚJ ÁLLAPOT A SZEREPKÖRNEK
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Induláskor ellenőrizzük, van-e token és szerepkör
    const bootstrapAsync = async () => {
      let token, role;
      try {
        token = await SecureStore.getItemAsync("userToken");
        role = await SecureStore.getItemAsync("userRole"); // <-- SZEREPKÖR OLVASÁSA
      } catch (e) {
        console.error("Hiba a perzisztens adatok lekérésekor", e);
      }
      setUserToken(token);
      setUserRole(role);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        // <-- Most már egy 'data' objektumot kap
        const { token, role } = data;
        setUserToken(token);
        setUserRole(role);
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userRole", role); // <-- SZEREPKÖR MENTÉSE
      },
      signOut: async () => {
        setUserToken(null);
        setUserRole(null);
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userRole"); // <-- SZEREPKÖR TÖRLÉSE
      },
      userToken,
      userRole, // <-- Elérhetővé tesszük a szerepkört
    }),
    [userToken, userRole]
  );

  return (
    <AuthContext.Provider value={{ ...authContext, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
