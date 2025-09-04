import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DeviceService } from '../services/deviceService';
import api from '../services/api';

export const useDeviceTracking = () => {
  const { user } = useAuth();
  const sessionRef = useRef(null);
  const isTrackingRef = useRef(false);

  // Inicializálja az eszköz követést
  const initializeTracking = async () => {
    if (isTrackingRef.current) return; // Már fut a követés
    
    try {
      isTrackingRef.current = true;
      
      // Eszköz információk gyűjtése
      const deviceInfo = await DeviceService.collectFullDeviceInfo();
      
      // Session ID generálása ha még nincs
      if (!sessionRef.current) {
        sessionRef.current = DeviceService.generateSessionId();
      }

      // User ID hozzáadása ha be van jelentkezve
      const sessionData = {
        ...deviceInfo,
        sessionId: sessionRef.current,
        userId: user?.token ? getUserIdFromToken(user.token) : null
      };

      // Adatok küldése a backend-re
      await sendDeviceSession(sessionData);
      
      // Session tárolása localStorage-ben
      localStorage.setItem('deviceSessionId', sessionRef.current);
      
    } catch (error) {
      console.error('Device tracking initialization failed:', error);
    }
  };

  // Eszköz session adatok küldése
  const sendDeviceSession = async (sessionData) => {
    try {
      const response = await api.post('/device/session', sessionData);
      return response.data;
    } catch (error) {
      console.error('Failed to send device session:', error);
      throw error;
    }
  };

  // Action logging
  const logAction = async (actionType, actionDetails = {}) => {
    if (!sessionRef.current) return;

    try {
      await api.post('/device/action', {
        sessionId: sessionRef.current,
        actionType,
        actionDetails,
        url: window.location.href,
        method: 'GET', // Default, módosítható
        responseCode: 200 // Default
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  // JWT token-ból user ID kinyerése
  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.data?.id || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Oldal elhagyásának követése
  const trackPageLeave = () => {
    if (navigator.sendBeacon && sessionRef.current) {
      const data = JSON.stringify({
        sessionId: sessionRef.current,
        actionType: 'page_leave',
        actionDetails: { url: window.location.href },
        timestamp: new Date().toISOString()
      });
      
      navigator.sendBeacon('/api/device/action', data);
    }
  };

  // Eszköz orientáció változás követése
  const trackOrientationChange = () => {
    if (sessionRef.current) {
      logAction('orientation_change', {
        orientation: window.screen.orientation?.type || 'unknown',
        angle: window.screen.orientation?.angle || 0,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  };

  // Network változás követése
  const trackConnectionChange = () => {
    if (sessionRef.current && navigator.connection) {
      logAction('connection_change', {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      });
    }
  };

  // Hook inicializálása
  useEffect(() => {
    // Session ID visszaállítása localStorage-ból
    const storedSessionId = localStorage.getItem('deviceSessionId');
    if (storedSessionId) {
      sessionRef.current = storedSessionId;
    }

    // Eszköz követés inicializálása
    initializeTracking();

    // Event listener-ek hozzáadása
    window.addEventListener('beforeunload', trackPageLeave);
    window.addEventListener('orientationchange', trackOrientationChange);
    
    if (navigator.connection) {
      navigator.connection.addEventListener('change', trackConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', trackPageLeave);
      window.removeEventListener('orientationchange', trackOrientationChange);
      
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', trackConnectionChange);
      }
      
      isTrackingRef.current = false;
    };
  }, [user]); // User változáskor újrainicializálás

  // Periodikus activity ping (5 percenként)
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionRef.current) {
        logAction('activity_ping', {
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      }
    }, 5 * 60 * 1000); // 5 perc

    return () => clearInterval(interval);
  }, []);

  // Visszaadott függvények és adatok
  return {
    sessionId: sessionRef.current,
    logAction,
    initializeTracking
  };
};