// Device detection service
export class DeviceService {
  static detectDevice() {
    const userAgent = navigator.userAgent;

    return {
      userAgent: userAgent,
      isMobile: this.isMobile(),
      isTablet: this.isTablet(),
      isDesktop: this.isDesktop(),
      deviceType: this.getDeviceType(),
      browserInfo: this.getBrowserInfo(),
      screenInfo: this.getScreenInfo(),
      connectionInfo: this.getConnectionInfo(),
    };
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static isTablet() {
    return /iPad|Android|tablet/i.test(navigator.userAgent) && !this.isMobile();
  }

  static isDesktop() {
    return !this.isMobile() && !this.isTablet();
  }

  static getDeviceType() {
    if (this.isMobile()) return "mobile";
    if (this.isTablet()) return "tablet";
    return "desktop";
  }

  static getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";

    // Chrome
    if (ua.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
    }
    // Firefox
    else if (ua.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
    }
    // Safari
    else if (ua.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
    }
    // Edge
    else if (ua.indexOf("Edge") > -1) {
      browserName = "Edge";
      browserVersion = ua.match(/Edge\/([0-9.]+)/)?.[1] || "Unknown";
    }
    // Internet Explorer
    else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
      browserName = "Internet Explorer";
      browserVersion = ua.match(/(?:MSIE |rv:)([0-9.]+)/)?.[1] || "Unknown";
    }

    return {
      name: browserName,
      version: browserVersion,
      platform: navigator.platform || "Unknown",
    };
  }

  static getScreenInfo() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
    };
  }

  static getConnectionInfo() {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      return {
        effectiveType: connection.effectiveType || "Unknown",
        downlink: connection.downlink || null,
        rtt: connection.rtt || null,
        saveData: connection.saveData || false,
      };
    }

    return {
      effectiveType: "Unknown",
      downlink: null,
      rtt: null,
      saveData: false,
    };
  }

  static async getLocationInfo() {
    try {
      // IP alapú lokáció lekérése
      const response = await fetch("http://ip-api.com/json/");
      const data = await response.json();

      return {
        country: data.country || "Unknown",
        countryCode: data.countryCode || "Unknown",
        region: data.regionName || "Unknown",
        city: data.city || "Unknown",
        latitude: data.lat || null,
        longitude: data.lon || null,
        timezone: data.timezone || "Unknown",
        isp: data.isp || "Unknown",
        organization: data.org || "Unknown",
      };
    } catch (error) {
      console.error("Error getting location info:", error);
      return {
        country: "Unknown",
        countryCode: "Unknown",
        region: "Unknown",
        city: "Unknown",
        latitude: null,
        longitude: null,
        timezone: "Unknown",
        isp: "Unknown",
        organization: "Unknown",
      };
    }
  }

  static generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static async collectFullDeviceInfo() {
    const basicInfo = this.detectDevice();
    const locationInfo = await this.getLocationInfo();

    return {
      ...basicInfo,
      ...locationInfo,
      sessionId: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || "Direct",
    };
  }
}
