import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HelperMap = () => {
  const defaultCenter = [51.505, -0.09]; // Example: London coordinates

  return (
    <div>not working</div>
    // <div style={{ height: "100vh", width: "100vw" }}>
    //   <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
    //     <TileLayer
    //       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     />
    //     <Marker position={defaultCenter}>
    //       <Popup>You are here!</Popup>
    //     </Marker>
    //   </MapContainer>
    // </div>
  );
};

export default HelperMap;
