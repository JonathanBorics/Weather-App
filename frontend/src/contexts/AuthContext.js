import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    console.log('--- AUTH CONTEXT: Állapot megváltozott! ---', {
      token: userToken,
      role: userRole,
    });
  }, [userToken, userRole]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token, role;
      try {
        token = await SecureStore.getItemAsync("userToken");
        role = await SecureStore.getItemAsync("userRole");
      } catch (e) {
        console.error("Hiba a perzisztens adatok lekérésekor", e);
      }
      setUserToken(token);
      setUserRole(role);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

const signIn = useCallback(async (data) => {
    console.log('--- AUTH CONTEXT: signIn funkció meghívva ---', data);
    try {
      const { token, role } = data;
      setUserToken(token);
      setUserRole(role);
      console.log('--- AUTH CONTEXT: setUserToken és setUserRole beállítva. ---');
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', role);
      console.log('--- AUTH CONTEXT: Adatok elmentve a SecureStore-ba. ---');
    } catch (error) {
      console.error('--- AUTH CONTEXT HIBA: Hiba a signIn során ---', error);
    }
  }, []);

  const signOut = useCallback(async () => {
    setUserToken(null);
    setUserRole(null);
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userRole");
  }, []);

  const value = {
    signIn,
    signOut,
    userToken,
    userRole,
  };

  return (
    <AuthContext.Provider value={{ ...value, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
