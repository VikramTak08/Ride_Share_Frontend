// // import  { useEffect,useState } from "react";
// // import { OlaMaps } from "olamaps-web-sdk";

// // const Practice = () => {

// //   const [routeData, setRouteData] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   // Your Ola Maps API key (stored in .env file)
// //   // const apiKey = process.env.API_KEY;

// //   // Coordinates for the request
// //   const origin = '18.76029027465273,73.3814242364375';
// //   const destination = '18.73354223011708,73.44587966939002';

// //   // Function to fetch directions
// //   const fetchDirections = async () => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const response = await fetch(
// //         `https://api.olamaps.io/routing/v1/directions?origin=${origin}&destination=${destination}&api_key=${"Zd2iUqmtg8UKMe4Wf1n5Ura5xG2pVLH30bL2uYv6"}`,
// //         {
// //           method: 'POST',
// //           headers: {
// //             'X-Request-Id': 'XXX', // Replace 'XXX' with a unique ID if needed
// //             'Content-Type': 'application/json', // Optional, depending on API requirements
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! Status: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       setRouteData(data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch data when the component mounts
// //   useEffect(() => {
// //     fetchDirections();
// //   }, []); // Empty dependency array means it runs once on mount


// //   useEffect(() => {
// //     const olaMaps = new OlaMaps({
// //       apiKey: "Zd2iUqmtg8UKMe4Wf1n5Ura5xG2pVLH30bL2uYv6", // Ensure this is a valid API key
// //     });

// //     const myMap = olaMaps.init({
// //       style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
// //       container: "map",
// //       center: [77.61648476788898, 12.931423492103944],
// //       zoom: 15,
// //     });

// //     const olaIcon = document.createElement("div");
// //     olaIcon.classList.add("olalogo");

// //     olaMaps
// //       .addMarker({ element: olaIcon, offset: [0, -10], anchor: "bottom" })
// //       .setLngLat([77.61648476788898, 12.931423492103944])
// //       .addTo(myMap);

// //     olaMaps
// //       .addMarker({ offset: [0, 6], anchor: "bottom" })
// //       .setLngLat([77.612484767, 12.934223492103444])
// //       .addTo(myMap);

// //     const popup = olaMaps
// //       .addPopup({ offset: [0, -30], anchor: "bottom" })
// //       .setHTML("<div>This is a simple Popup</div>");

// //     olaMaps
// //       .addMarker({
// //         offset: [0, 6],
// //         anchor: "bottom",
// //         color: "red",
// //         draggable: true,
// //       })
// //       .setLngLat([77.6196390456908, 12.93321052215299])
// //       .setPopup(popup)
// //       .addTo(myMap);
// //   }, []);

// //   return (<>
// //   <div id="map" style={{ width: "80%", height: "400px",border:"3px" }}></div>
// //   <div>
// //       <h1>Ola Maps Directions</h1>
// //       {loading && <p>Loading...</p>}
// //       {error && <p>Error: {error}</p>}
// //       {routeData ? (
// //         <div>
// //           <h2>Route Details</h2>
// //           <pre>{JSON.stringify(routeData, null, 2)}</pre> {/* Display raw JSON */}
// //         </div>
// //       ) : (
// //         !loading && !error && <p>No data available yet.</p>
// //       )}
// //       <button onClick={fetchDirections}>Refresh Directions</button>
// //     </div>
// //   </>
 
// // );
// // };

// // export default Practice;






//   //const apiKey = "Zd2iUqmtg8UKMe4Wf1n5Ura5xG2pVLH30bL2uYv6"; // Replace with your API key
  


//   // import { useEffect } from "react";
//   // import { OlaMaps } from "olamaps-web-sdk";
  
//   // const Practice = () => {
//   //   useEffect(() => {
//   //     const olaMaps = new OlaMaps({
//   //       apiKey: "Zd2iUqmtg8UKMe4Wf1n5Ura5xG2pVLH30bL2uYv6", // Ensure this is a valid API key
//   //     });
  
//   //     const myMap = olaMaps.init({
//   //       style:
//   //         "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
//   //       container: "map",
//   //       center: [77.61648476788898, 12.931423492103944],
//   //       zoom: 15,
//   //     });
  
//   //     const olaIcon = document.createElement("div");
//   //     olaIcon.classList.add("olalogo");
  
//   //     olaMaps
//   //       .addMarker({ element: olaIcon, offset: [0, -10], anchor: "bottom" })
//   //       .setLngLat([77.61648476788898, 12.931423492103944])
//   //       .addTo(myMap);
  
//   //     olaMaps
//   //       .addMarker({ offset: [0, 6], anchor: "bottom" })
//   //       .setLngLat([77.612484767, 12.934223492103444])
//   //       .addTo(myMap);
  
//   //     const popup = olaMaps
//   //       .addPopup({ offset: [0, -30], anchor: "bottom" })
//   //       .setHTML("<div>This is a simple Popup</div>");
  
//   //     olaMaps
//   //       .addMarker({
//   //         offset: [0, 6],
//   //         anchor: "bottom",
//   //         color: "red",
//   //         draggable: true,
//   //       })
//   //       .setLngLat([77.6196390456908, 12.93321052215299])
//   //       .setPopup(popup)
//   //       .addTo(myMap);
//   //   }, []);
  
//   //   return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
//   // };
  
//   // export default Practice;


//   import { useEffect } from "react";
// import { OlaMaps } from "olamaps-web-sdk";

// const Practice = () => {
//   useEffect(() => {
//     const olaMaps = new OlaMaps({
//       apiKey: "Zd2iUqmtg8UKMe4Wf1n5Ura5xG2pVLH30bL2uYv6", // Ensure this is a valid API key
//     });

//     // Initialize the map
//     const myMap = olaMaps.init({
//       style: {
//         version: 8,
//         sources: {
//           ola: {
//             type: "vector",
//             tiles: ["https://api.olamaps.io/tiles/vector/v1/tiles/{z}/{x}/{y}.pbf"],
//           },
//         },
//         layers: [
//           {
//             id: "background",
//             type: "background",
//             paint: { "background-color": "#f0f0f0" },
//           },
//           {
//             id: "roads",
//             type: "line",
//             source: "ola",
//             "source-layer": "roads", // Adjust based on available layers
//             paint: { "line-color": "#000000", "line-width": 1 },
//           },
//         ],
//       },
//       container: "map",
//       center: [77.61648476788898, 12.931423492103944],
//       zoom: 15,
//     });

//     // Add custom marker
//     const olaIcon = document.createElement("div");
//     olaIcon.classList.add("olalogo");

//     olaMaps
//       .addMarker({ element: olaIcon, offset: [0, -10], anchor: "bottom" })
//       .setLngLat([77.61648476788898, 12.931423492103944])
//       .addTo(myMap);

//     // Add default marker
//     olaMaps
//       .addMarker({ offset: [0, 6], anchor: "bottom" })
//       .setLngLat([77.612484767, 12.934223492103444])
//       .addTo(myMap);

//     // Add popup and draggable marker
//     const popup = olaMaps
//       .addPopup({ offset: [0, -30], anchor: "bottom" })
//       .setHTML("<div>This is a simple Popup</div>");

//     olaMaps
//       .addMarker({
//         offset: [0, 6],
//         anchor: "bottom",
//         color: "red",
//         draggable: true,
//       })
//       .setLngLat([77.6196390456908, 12.93321052215299])
//       .setPopup(popup)
//       .addTo(myMap);

//     // Log map initialization to debug
//     console.log("Map initialized:", myMap);
//   }, []);

//   return <div id="map" style={{ width: "100%", height: "500px" }} />;
// };

// export default Practice;