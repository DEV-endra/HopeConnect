import styles from "../styles/HelperMap.module.css";
import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup
} from "react-simple-maps";

const geoUrl = "/features.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = () => {
  const [data, setData] = useState([]);
  const [zoom, setZoom] = useState(1); // Default zoom level
  const [center, setCenter] = useState([0, 0]); // Default center of the map

  useEffect(() => {
    csv(`/vulnerability.csv`).then((data) => {
      setData(data);
    });
  }, []);

  // Handle zooming on mouse scroll
  const handleZoom = (event) => {
    event.preventDefault();
    const newZoom = Math.min(Math.max(zoom + event.deltaY * -0.001, 1), 5);
    setZoom(newZoom);
  };

  // Handle panning when mouse moves while zoomed in
  const handleMouseMove = (event) => {
    if (zoom > 1) {
      const { movementX, movementY } = event;
      setCenter(([x, y]) => [x - movementX * 0.5, y + movementY * 0.5]);
    }
  };

  return (
    <div onWheel={handleZoom} onMouseMove={handleMouseMove}>
      <ComposableMap>
        <ZoomableGroup zoom={zoom} center={center}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          {data.length > 0 && (
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find((s) => s.ISO3 === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(d["2017"]) : "#F5F4F6"}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
