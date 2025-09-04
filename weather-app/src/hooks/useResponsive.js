import { useState, useEffect } from "react";

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [deviceType, setDeviceType] = useState("desktop");
  const [orientation, setOrientation] = useState("portrait");

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Device type detection based on Bootstrap breakpoints
      if (width < 576) {
        setDeviceType("mobile");
      } else if (width < 768) {
        setDeviceType("mobile-large");
      } else if (width < 992) {
        setDeviceType("tablet");
      } else if (width < 1200) {
        setDeviceType("desktop");
      } else {
        setDeviceType("desktop-large");
      }

      // Orientation detection
      setOrientation(width > height ? "landscape" : "portrait");
    };

    // Initial check
    updateScreenInfo();

    // Event listeners
    window.addEventListener("resize", updateScreenInfo);
    window.addEventListener("orientationchange", updateScreenInfo);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateScreenInfo);
      window.removeEventListener("orientationchange", updateScreenInfo);
    };
  }, []);

  // Helper functions
  const isMobile = deviceType === "mobile" || deviceType === "mobile-large";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop" || deviceType === "desktop-large";
  const isLandscape = orientation === "landscape";
  const isPortrait = orientation === "portrait";

  // Breakpoint checks (Bootstrap compatible)
  const isXs = screenSize.width < 576;
  const isSm = screenSize.width >= 576 && screenSize.width < 768;
  const isMd = screenSize.width >= 768 && screenSize.width < 992;
  const isLg = screenSize.width >= 992 && screenSize.width < 1200;
  const isXl = screenSize.width >= 1200 && screenSize.width < 1400;
  const isXxl = screenSize.width >= 1400;

  // Touch device detection
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Network connection info (if available)
  const [connectionInfo, setConnectionInfo] = useState({
    effectiveType: "4g",
    saveData: false,
    downlink: 10,
  });

  useEffect(() => {
    const updateConnection = () => {
      if ("connection" in navigator) {
        const conn = navigator.connection;
        setConnectionInfo({
          effectiveType: conn.effectiveType || "4g",
          saveData: conn.saveData || false,
          downlink: conn.downlink || 10,
        });
      }
    };

    updateConnection();

    if ("connection" in navigator) {
      navigator.connection.addEventListener("change", updateConnection);
      return () =>
        navigator.connection.removeEventListener("change", updateConnection);
    }
  }, []);

  // Dark mode preference
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDarkMode(mediaQuery.matches);

    const handleChange = (e) => setPrefersDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Responsive column calculation
  const getResponsiveColumns = (
    mobile = 1,
    tablet = 2,
    desktop = 3,
    large = 4
  ) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    if (isDesktop) return desktop;
    return large;
  };

  // Bootstrap col classes generator
  const getBootstrapCols = (xs = 12, sm = 6, md = 4, lg = 3, xl = 3) => {
    return `col-${xs} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl}`;
  };

  // Container class generator
  const getContainerClass = (fluid = false) => {
    if (fluid) return "container-fluid";
    if (isXxl) return "container-xxl";
    if (isXl) return "container-xl";
    if (isLg) return "container-lg";
    if (isMd) return "container-md";
    if (isSm) return "container-sm";
    return "container";
  };

  return {
    // Screen info
    screenSize,
    deviceType,
    orientation,

    // Device type helpers
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isLandscape,
    isPortrait,

    // Breakpoint helpers
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,

    // User preferences
    prefersDarkMode,
    prefersReducedMotion,

    // Network info
    connectionInfo,

    // Utility functions
    getResponsiveColumns,
    getBootstrapCols,
    getContainerClass,
  };
};
