import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Form, InputGroup, Button } from "react-bootstrap";
import { DeviceService } from "../services/deviceService";

const DeviceAnalytics = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    collectDeviceInfo();
  }, []);

  const collectDeviceInfo = async () => {
    const info = await DeviceService.collectFullDeviceInfo();
    setDeviceInfo(info);

    // Itt küldenénk el az adatokat a backend-nek
    console.log("Device info collected:", info);
  };

  if (!deviceInfo) {
    return (
      <Card>
        <Card.Body>
          <p>Device információk betöltése...</p>
        </Card.Body>
      </Card>
    );
  }

  const deviceData = [
    { label: "Eszköz típus", value: deviceInfo.deviceType, type: "device" },
    {
      label: "Mobil",
      value: deviceInfo.isMobile ? "Igen" : "Nem",
      type: "boolean",
    },
    {
      label: "Tablet",
      value: deviceInfo.isTablet ? "Igen" : "Nem",
      type: "boolean",
    },
    {
      label: "Asztal",
      value: deviceInfo.isDesktop ? "Igen" : "Nem",
      type: "boolean",
    },
    {
      label: "Böngésző",
      value: `${deviceInfo.browserInfo.name} ${deviceInfo.browserInfo.version}`,
      type: "browser",
    },
    {
      label: "Platform",
      value: deviceInfo.browserInfo.platform,
      type: "platform",
    },
    {
      label: "Képernyő felbontás",
      value: `${deviceInfo.screenInfo.width}x${deviceInfo.screenInfo.height}`,
      type: "screen",
    },
    {
      label: "Elérhető terület",
      value: `${deviceInfo.screenInfo.availWidth}x${deviceInfo.screenInfo.availHeight}`,
      type: "screen",
    },
    {
      label: "Színmélység",
      value: `${deviceInfo.screenInfo.colorDepth} bit`,
      type: "screen",
    },
    {
      label: "Kapcsolat típus",
      value: deviceInfo.connectionInfo.effectiveType,
      type: "connection",
    },
    {
      label: "Letöltési sebesség",
      value: deviceInfo.connectionInfo.downlink
        ? `${deviceInfo.connectionInfo.downlink} Mbps`
        : "Ismeretlen",
      type: "connection",
    },
    {
      label: "RTT",
      value: deviceInfo.connectionInfo.rtt
        ? `${deviceInfo.connectionInfo.rtt} ms`
        : "Ismeretlen",
      type: "connection",
    },
    { label: "Ország", value: deviceInfo.country, type: "location" },
    { label: "Régió", value: deviceInfo.region, type: "location" },
    { label: "Város", value: deviceInfo.city, type: "location" },
    {
      label: "Koordináták",
      value:
        deviceInfo.latitude && deviceInfo.longitude
          ? `${deviceInfo.latitude}, ${deviceInfo.longitude}`
          : "Ismeretlen",
      type: "location",
    },
    { label: "Időzóna", value: deviceInfo.timezone, type: "location" },
    { label: "ISP", value: deviceInfo.isp, type: "network" },
    { label: "Szervezet", value: deviceInfo.organization, type: "network" },
    { label: "Session ID", value: deviceInfo.sessionId, type: "session" },
    {
      label: "Időbélyeg",
      value: new Date(deviceInfo.timestamp).toLocaleString("hu-HU"),
      type: "session",
    },
  ];

  const getTypeColor = (type) => {
    const colors = {
      device: "primary",
      boolean: "success",
      browser: "info",
      platform: "secondary",
      screen: "warning",
      connection: "danger",
      location: "dark",
      network: "light",
      session: "outline-primary",
    };
    return colors[type] || "secondary";
  };

  const filteredData = deviceData.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Eszköz Analitika</h5>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={collectDeviceInfo}
          >
            Frissítés
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Keresés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <div className="table-responsive">
          <Table striped hover size="sm">
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("label")}
                >
                  Tulajdonság
                  {sortField === "label" && (
                    <span className="ms-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("value")}
                >
                  Érték
                  {sortField === "value" && (
                    <span className="ms-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("type")}
                >
                  Kategória
                  {sortField === "type" && (
                    <span className="ms-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>{item.label}</strong>
                  </td>
                  <td>
                    <code>{item.value}</code>
                  </td>
                  <td>
                    <Badge bg={getTypeColor(item.type)}>{item.type}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {sortedData.length === 0 && (
          <div className="text-center text-muted">
            Nincs találat a keresési feltételekhez.
          </div>
        )}

        <div className="mt-3">
          <small className="text-muted">
            Összesen {filteredData.length} elem ({deviceData.length} összesből)
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DeviceAnalytics;
