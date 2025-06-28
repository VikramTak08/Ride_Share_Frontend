/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-control-geocoder";
// import "leaflet-control-geocoder/dist/Control.Geocoder.css";

// const MAP_CONFIG = {
//   defaultCenter: [23.215, 77.415],
//   defaultZoom: 15,
//   tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//   attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// };

// const MapComponent = ({ mapRef, routingControlRef }) => {
//   const mapContainerRef = useRef(null);

//   useEffect(() => {
//     const map = L.map(mapRef.current).setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom);
//     L.tileLayer(MAP_CONFIG.tileUrl, { attribution: MAP_CONFIG.attribution }).addTo(map);

//     const control = L.Routing.control({
//       waypoints: [],
//       routeWhileDragging: true,
//       geocoder: false,
//       lineOptions: { styles: [{ color: "black", opacity: 0.8, weight: 6 }] }
//     }).addTo(map);

//     routingControlRef.current = control;
//     setTimeout(() => map.invalidateSize(), 0);

//     return () => map.remove();
//   }, [mapRef, routingControlRef]);

//   return (
//     <div className="relative w-full h-96 lg:h-full rounded-lg shadow-lg overflow-hidden">
//       <div ref={mapRef} className="w-full h-full z-10" />
//     </div>
//   );
// };

// export default MapComponent;