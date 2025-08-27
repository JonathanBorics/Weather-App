import React, { createContext, useState, useMemo, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(() => ({
    signIn: async (token) => {
      setUserToken(token);
      await SecureStore.setItemAsync('userToken', token);
    },
    signOut: async () => {
      setUserToken(null);
      await SecureStore.deleteItemAsync('userToken');
    },
    userToken,
  }), [userToken]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.error('Hiba a token lekérésekor', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authContext, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};