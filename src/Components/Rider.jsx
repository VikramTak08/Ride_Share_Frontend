/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import { RxCross2 } from "react-icons/rx";
import { FaCar, FaBus, FaMotorcycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Rider = () => {
  const [showDriverList, setShowDriverList] = useState(false);
  const mapRef = useRef(null);
  const [routingControl, setRoutingControl] = useState(null);
  const waypointsRef = useRef([]);
  const markersRef = useRef([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [driverList, setDriverList] = useState([]);
  const [suggestions, setSuggestions] = useState({
    pickup: [],
    destination: [],
  });
  const navigate = useNavigate();

  const getCoordinates = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lat), parseFloat(lon)];
    } else {
      console.error("No coordinates found for the address:", address);
      return null;
    }
  };

  const handleSave = async () => {
    const pickupCoords = await getCoordinates(pickupLocation);
    const destinationCoords = await getCoordinates(destinationLocation);

    if (pickupCoords && destinationCoords) {
      setPickupCoords(pickupCoords);
      setDestinationCoords(destinationCoords);

      const riderData = {
        pickupCoords: [pickupCoords[1], pickupCoords[0]],
        destinationCoords: [destinationCoords[1], destinationCoords[0]],
      };

      try {
        //https://ride-share-backend.onrender.com ,http://localhost:5000
        
        const BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${BASE_URL}/match-drivers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(riderData),
        });

        if (response.ok) {
          const data = await response.json();
          setDriverList(data.drivers);
        } else {
          console.error("Failed to find drivers");
        }
      } catch (error) {
        console.error("Error finding drivers:", error);
      }
    }
    setShowDriverList(true);
  };

  const handleBackToInput = () => {
    setShowDriverList(false);
    setSelectedDriver(null); // Reset selected driver when going back
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    console.log("Driver clicked:", driver);

    const driverPickup = driver.startLocation;
    const driverDestination = driver.destinationLocation;

    if (driverPickup && driverDestination) {
      L.Control.Geocoder.nominatim().geocode(driverPickup, (pickupResults) => {
        L.Control.Geocoder.nominatim().geocode(
          driverDestination,
          (destinationResults) => {
            if (pickupResults.length > 0 && destinationResults.length > 0) {
              const pickupLatLng = pickupResults[0].center;
              const destinationLatLng = destinationResults[0].center;

              routingControl.setWaypoints([
                L.latLng(pickupLatLng.lat, pickupLatLng.lng),
                L.latLng(destinationLatLng.lat, destinationLatLng.lng),
              ]);

              L.map("map").fitBounds([
                [pickupLatLng.lat, pickupLatLng.lng],
                [destinationLatLng.lat, destinationLatLng.lng],
              ]);

              const pickupMarker = L.marker(pickupLatLng)
                .addTo(L.map("map"))
                .bindPopup("Pickup: " + pickupResults[0].name)
                .openPopup();

              const destinationMarker = L.marker(destinationLatLng)
                .addTo(L.map("map"))
                .bindPopup("Destination: " + destinationResults[0].name)
                .openPopup();

              markersRef.current.push(pickupMarker, destinationMarker);
            } else {
              alert("Could not find one of the locations.");
            }
          }
        );
      });
    } else {
      alert("Please enter both pickup and destination locations.");
    }
  };

  useEffect(() => {
    const map = L.map(mapRef.current).setView([23.215, 77.415], 15);
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution =
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(map);

    const control = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
      geocoder: false,
      lineOptions: {
        styles: [{ color: "black", opacity: 0.8, weight: 6 }],
      },
      show: false,
      addWaypoints: false,
      //routeWhileDragging: false,
      showAlternatives: false,
    }).addTo(map);

    setRoutingControl(control);

    return () => {
      map.remove();
    };
  }, []);

  const resetMap = () => {
    waypointsRef.current = [];
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    routingControl.setWaypoints([]);
    setPickupLocation("");
    setDestinationLocation("");
    setSuggestions({ pickup: [], destination: [] });
    setSelectedDriver(null);
  };

  const resetPickup = () => {
    setPickupLocation("");
  };

  const resetDestination = () => {
    setDestinationLocation("");
  };

  const fetchSuggestions = (query, field) => {
    if (query.length < 3) return;

    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const formattedSuggestions = data.map((item) => ({
          label: item.display_name,
          latLng: [item.lat, item.lon],
        }));

        if (field === "pickup") {
          setSuggestions((prev) => ({ ...prev, pickup: formattedSuggestions }));
        } else if (field === "destination") {
          setSuggestions((prev) => ({
            ...prev,
            destination: formattedSuggestions,
          }));
        }
      })
      .catch((error) => console.error("Error fetching suggestions:", error));
  };

  const handleSuggestionClick = (suggestion, field) => {
    if (field === "pickup") {
      setPickupLocation(suggestion.label);
      setSuggestions((prev) => ({ ...prev, pickup: [] }));
    } else if (field === "destination") {
      setDestinationLocation(suggestion.label);
      setSuggestions((prev) => ({ ...prev, destination: [] }));
    }
  };

  const handleBookRide = () => {
    if (selectedDriver) {
      
      const rideData = {
        name: selectedDriver.name,
        fare: selectedDriver.fare,
        vehicle: selectedDriver.vehicle,
      };
      localStorage.setItem("rideStatus", JSON.stringify({
        driverName: rideData.name,
        fare: rideData.fare,
        vehicle: rideData.vehicle,
      }));
      navigate("/driver-status", { state: { driver: rideData } });
    }
  };

  return (
    <div className="lg:pt-[65px] bg-white h-screen md:h-auto lg:h-screen">
      <div className="flex lg:flex-row flex-col p-1 gap-1 w-full h-screen lg:h-96">
        <div className="h-[52px]"></div>
        <div
          id="map"
          ref={mapRef}
          className="relative z-10 flex-1 rounded-lg shadow-lg"
        ></div>

        <div className="relative flex-1 shadow-lg pt-1 lg:pt-3 rounded">
          {!showDriverList ? (
            <div className="p-2">
              <div className="flex flex-col p-4 gap-4 md:flex-col w-full">
                <div className="relative">
                  <input
                    type="text"
                    className="border bg-gray-200 border-gray-200 rounded-lg p-2 pr-10 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      fetchSuggestions(e.target.value, "pickup");
                    }}
                  />
                  <RxCross2
                    onClick={resetPickup}
                    className="absolute top-1/2 cursor-pointer right-3 text-xl transform -translate-y-1/2 text-gray-600"
                  />
                  {suggestions.pickup.length > 0 && (
                    <ul className="absolute top-full left-0 bg-white shadow-lg w-full z-10 max-h-40 overflow-y-auto">
                      {suggestions.pickup.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSuggestionClick(suggestion, "pickup")}
                        >
                          {suggestion.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="border bg-gray-200 border-gray-200 rounded-lg p-2 pr-10 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter destination location"
                    value={destinationLocation}
                    onChange={(e) => {
                      setDestinationLocation(e.target.value);
                      fetchSuggestions(e.target.value, "destination");
                    }}
                  />
                  <RxCross2
                    onClick={resetDestination}
                    className="absolute top-1/2 cursor-pointer right-3 text-xl transform -translate-y-1/2 text-gray-600"
                  />
                  {suggestions.destination.length > 0 && (
                    <ul className="absolute top-full left-0 bg-white shadow-lg w-full z-10 max-h-40 overflow-y-auto">
                      {suggestions.destination.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleSuggestionClick(suggestion, "destination")}
                        >
                          {suggestion.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex px-4 space-x-6 md:mt-0">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
                >
                  Find Drivers
                </button>
                <button
                  type="button"
                  onClick={resetMap}
                  className="bg-red-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="p-1 inset-x-0 bottom-0 border-t rounded-t-lg max-h-[410px] animate-slide-up">
              <button
                className="absolute top-5 right-5 text-3xl text-gray-700 hover:text-gray-900"
                onClick={handleBackToInput}
              >
                <RxCross2 />
              </button>
              <div className="text-3xl text-center">
                <h1>Available Drivers</h1>
              </div>
              <div className="grid grid-cols-1 bg-gray-50 rounded-lg lg:mt-5 gap-4 p-1 max-h-[310px] overflow-y-scroll">
                {driverList.length > 0 ? (
                  driverList.map((driver, index) => (
                    <div
                      key={index}
                      onClick={() => handleDriverClick(driver)}
                      className={`flex items-center border-2 justify-between gap-4 rounded-3xl w-full p-3 cursor-pointer ${
                        selectedDriver === driver
                          ? "border-green-500 bg-green-100"
                          : "border-gray-200 bg-gray-200 hover:bg-green-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          {driver.vehicle.trim().toLowerCase() === "car" && (
                            <FaCar className="text-3xl" />
                          )}
                          {driver.vehicle.trim().toLowerCase() === "bus" && (
                            <FaBus className="text-3xl" />
                          )}
                          {driver.vehicle.trim().toLowerCase() === "bike" && (
                            <FaMotorcycle className="text-3xl" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{driver.name}</h2>
                          <p>
                            <strong>Seats:</strong> {driver.seats}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Rs {driver.fare}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="justify-center text-2xl">
                    <p>No drivers found</p>
                  </div>
                )}
              </div>
              <div className="h-auto justify-center">
                <button
                  onClick={handleBookRide}
                  disabled={!selectedDriver}
                  className={`p-3 w-full justify-center text-white ${
                    selectedDriver
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                >
                  Book
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rider;







// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { useEffect, useRef, useState } from "react";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-control-geocoder/dist/Control.Geocoder.css";
// import L from "leaflet";
// import "leaflet-routing-machine";
// import "leaflet-control-geocoder";
// import { RxCross2 } from "react-icons/rx";
// // import { CiLocationOn } from "react-icons/ci";
// //  import { useNavigate } from "react-router-dom";
// // import DriverList from "./DriverList";

// import { FaCar, FaBus, FaMotorcycle } from "react-icons/fa";
// // import axios from "axios";

// const Rider = () => {
//   const [showDriverList, setShowDriverList] = useState(false);
//   const mapRef = useRef(null);
//   const [routingControl, setRoutingControl] = useState(null);
//   const waypointsRef = useRef([]);
//   const markersRef = useRef([]);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   // const [pickup, setPickup] = useState("");
//   // const [destination, setDestination] = useState("");

//   //driver input
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");

//   //rider input
//   const [pickupCoords, setPickupCoords] = useState(null);
//   const [destinationCoords, setDestinationCoords] = useState(null);

//   //available drivers
//   const [driverList, setDriverList] = useState([]);
//   const [suggestions, setSuggestions] = useState({
//     pickup: [],
//     destination: [],
//   });
//   // const [selectedDriver, setSelectedDriver] = useState(null);
//   // console.log(selectedDriver);
//   // console.log("Rider pickup :", riderPickup);
//   // console.log("Rider destination :", riderDestination);
//   console.log("Rider pickupCoord :", pickupCoords);
//   console.log("Rider destinationCoord :", destinationCoords);

//   const getCoordinates = async (address) => {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`
//     );
//     const data = await response.json();
//     if (data && data.length > 0) {
//       const { lat, lon } = data[0];
//       return [parseFloat(lat), parseFloat(lon)];
//     } else {
//       console.error("No coordinates found for the address:", address);
//       return null;
//     }
//   };

//   const handleSave = async () => {
//     const pickupCoords = await getCoordinates(pickupLocation);
//     const destinationCoords = await getCoordinates(destinationLocation);

//     if (pickupCoords && destinationCoords) {
//       setPickupCoords(pickupCoords);
//       setDestinationCoords(destinationCoords);

//       const riderData = {
//         pickupCoords: [pickupCoords[1], pickupCoords[0]],
//         destinationCoords: [destinationCoords[1], destinationCoords[0]],
//       };

//       try {
//         const response = await fetch("http://localhost:5000/match-drivers", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(riderData),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setDriverList(data.drivers);
//         } else {
//           console.error("Failed to find drivers");
//         }
//       } catch (error) {
//         console.error("Error finding drivers:", error);
//       }
//     }
//     setShowDriverList(true);
//   };

//   const handleBackToInput = () => {
//     setShowDriverList(false);
//   };

//   const handleDriverClick = (driver) => {
//     setSelectedDriver(driver);
//     console.log("Driver clicked:", driver);

//     // Optionally, you can zoom to the driver's route on the map or highlight it
//     const driverPickup = driver.startLocation;
//     const driverDestination = driver.destinationLocation;

//     if (driverPickup && driverDestination) {
//       L.Control.Geocoder.nominatim().geocode(driverPickup, (pickupResults) => {
//         L.Control.Geocoder.nominatim().geocode(
//           driverDestination,
//           (destinationResults) => {
//             if (pickupResults.length > 0 && destinationResults.length > 0) {
//               const pickupLatLng = pickupResults[0].center;
//               const destinationLatLng = destinationResults[0].center;

//               // Set waypoints for routing control
//               routingControl.setWaypoints([
//                 L.latLng(pickupLatLng.lat, pickupLatLng.lng),
//                 L.latLng(destinationLatLng.lat, destinationLatLng.lng),
//               ]);

//               //Fit map to route bounds
//               L.map("map").fitBounds([
//                 [pickupLatLng.lat, pickupLatLng.lng],
//                 [destinationLatLng.lat, destinationLatLng.lng],
//               ]);

//               // Add markers
//               const pickupMarker = L.marker(pickupLatLng)
//                 .addTo(L.map("map"))
//                 .bindPopup("Pickup: " + pickupResults[0].name)
//                 .openPopup();

//               const destinationMarker = L.marker(destinationLatLng)
//                 .addTo(L.map("map"))
//                 .bindPopup("Destination: " + destinationResults[0].name)
//                 .openPopup();

//               markersRef.current.push(pickupMarker, destinationMarker);
//             } else {
//               alert("Could not find one of the locations.");
//             }
//           }
//         );
//       });
//     } else {
//       alert("Please enter both pickup and destination locations.");
//     }
//   };

//   useEffect(() => {
//     // Initialize the map
//     const map = L.map(mapRef.current).setView([23.215, 77.415], 15);
//     const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
//     const attribution =
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//     const tiles = L.tileLayer(tileUrl, { attribution });
//     tiles.addTo(map);

//     //ROUTE FORMATION
//     const control = L.Routing.control({
//       waypoints: [],
//       routeWhileDragging: true,
//       // geocoder: L.Control.Geocoder.nominatim(),
//       geocoder: false,
//       lineOptions: {
//         styles: [{ color: "black", opacity: 0.8, weight: 6 }],
//       },
//       show: false, // Hide the routing container
//       addWaypoints: false, // Disable adding waypoints by clicking
//       // eslint-disable-next-line no-dupe-keys
//       routeWhileDragging: false, // Optional: Disable dragging to reroute
//       showAlternatives: false,
//     }).addTo(map);

//     setRoutingControl(control);

//     // Cleanup on component unmount
//     return () => {
//       map.remove();
//     };
//   }, []);

//   //RESET MAP BUTTON
//   const resetMap = () => {
//     waypointsRef.current = [];
//     markersRef.current.forEach((marker) => marker.remove());
//     markersRef.current = [];
//     routingControl.setWaypoints([]);
//     // setPickup("");
//     // setDestination("");
//     setPickupLocation("");
//     setDestinationLocation("");
//     setSuggestions({ pickup: [], destination: [] });
//   };
//   const resetPickup = () => {
//     setPickupLocation("");
//   };
//   const resetDestination = () => {
//     setDestinationLocation("");
//   };

//   // Function to fetch suggestions from Nominatim
//   const fetchSuggestions = (query, field) => {
//     if (query.length < 3) return;

//     const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         const formattedSuggestions = data.map((item) => ({
//           label: item.display_name,
//           latLng: [item.lat, item.lon],
//         }));

//         if (field === "pickup") {
//           setSuggestions((prev) => ({ ...prev, pickup: formattedSuggestions }));
//         } else if (field === "destination") {
//           setSuggestions((prev) => ({
//             ...prev,
//             destination: formattedSuggestions,
//           }));
//         }
//       })
//       .catch((error) => console.error("Error fetching suggestions:", error));
//   };

//   const handleSuggestionClick = (suggestion, field) => {
//     if (field === "pickup") {
//       setPickupLocation(suggestion.label);
//       setSuggestions((prev) => ({ ...prev, pickup: [] }));
//     } else if (field === "destination") {
//       setDestinationLocation(suggestion.label);
//       setSuggestions((prev) => ({ ...prev, destination: [] }));
//     }
//   };
//   const handleBookRide = () => {
//     if (selectedDriver) {
//       alert(
//         `Ride booked with ${selectedDriver.name} for Rs ${selectedDriver.fare}`
//       );
//       // Add your booking logic here (e.g., API call)
//     }
//   };

//   return (
//     // <div className="relative z-10 flex flex-col h-screen pt-6 pb-4  bg-gray-100 ">
//     <div className=" lg:pt-[65px]    bg-white h-screen md:h-auto lg:h-screen  ">
//       <div className="flex lg:flex-row flex-col p-1 gap-1 w-full h-screen lg:h-96 ">
//         <div className="h-[52px]"></div>
//         {/* MAP COMPONENT */}
//         <div
//           id="map"
//           ref={mapRef}
//           //  style={{ width: "50%" }}
//           className="relative z-10 flex-1       rounded-lg shadow-lg "
//           // onClick={onMapClick}
//         ></div>

//         <div className="relative flex-1  shadow-lg   pt-1 lg:pt-3  rounded ">
//           {!showDriverList ? (
//             <div
//               // onSubmit={}
//               className="p-2"
//             >
//               <div className="flex flex-col p-4 gap-4 md:flex-col  w-full">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     className="border bg-gray-200 border-gray-200 rounded-lg p-2 pr-10 w-full  text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter pickup location"
//                     value={pickupLocation}
//                     onChange={(e) => {
//                       setPickupLocation(e.target.value);
//                       fetchSuggestions(e.target.value, "pickup");
//                     }}
//                   />
//                   <RxCross2
//                     onClick={resetPickup}
//                     className="absolute top-1/2  cursor-pointer right-3 text-xl  transform -translate-y-1/2 text-gray-600"
//                   />
//                   {suggestions.pickup.length > 0 && (
//                     <ul className="absolute top-full left-0 bg-white shadow-lg w-full z-10 max-h-40 overflow-y-auto">
//                       {suggestions.pickup.map((suggestion, idx) => (
//                         <li
//                           key={idx}
//                           className="p-2 hover:bg-gray-200  cursor-pointer"
//                           onClick={() =>
//                             handleSuggestionClick(suggestion, "pickup")
//                           }
//                         >
//                           {/* <CiLocationOn  className="absolute top-1/2  cursor-pointer left-2 text-xl  transform -translate-y-1/2 text-gray-600" /> */}
//                           {suggestion.label}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//                 <div className="relative ">
//                   <input
//                     type="text"
//                     className="border bg-gray-200 border-gray-200 rounded-lg p-2 pr-10 w-full  text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter destination location"
//                     value={destinationLocation}
//                     onChange={(e) => {
//                       setDestinationLocation(e.target.value);
//                       fetchSuggestions(e.target.value, "destination");
//                     }}
//                   />
//                   <RxCross2
//                     onClick={resetDestination}
//                     className="absolute top-1/2  cursor-pointer right-3 text-xl  transform -translate-y-1/2 text-gray-600"
//                   />
//                   {suggestions.destination.length > 0 && (
//                     <ul className="absolute top-full left-0 bg-white shadow-lg w-full z-10 max-h-40 overflow-y-auto">
//                       {suggestions.destination.map((suggestion, idx) => (
//                         <li
//                           key={idx}
//                           className="p-2 hover:bg-gray-200 cursor-pointer"
//                           onClick={() =>
//                             handleSuggestionClick(suggestion, "destination")
//                           }
//                         >
//                           {suggestion.label}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//               <div className="flex px-4 space-x-6  md:mt-0">
//                 <button
//                   type="button"
//                   // onClick={handleSave}
//                   onClick={() => {
//                     handleSave();
//                   }}
//                   className="bg-blue-600 text-white  p-2 rounded-lg transition-transform transform hover:scale-105"
//                 >
//                   Find Drivers
//                 </button>

//                 <button
//                   type="button"
//                   onClick={resetMap}
//                   className="bg-red-600 text-white p-2 rounded-lg transition-transform transform hover:scale-105"
//                 >
//                   Reset
//                 </button>
//               </div>
//               {/* <button
//                 className="bg-black text-white px-2 py-2 mt-20  rounded w-full"
//                 // onClick ={()=>{handleConfirm()}}
//                 type="submit"
//               >
//                 Confirm
//               </button> */}
//             </div>
//           ) : (
//             // {submittedData && <DriverList data={submittedData} />}
//             <div className=" p-1   inset-x-0 bottom-0 border-t  rounded-t-lg max-h-[410px] animate-slide-up">
//               <button
//                 className="absolute top-5 right-5  text-3xl text-gray-700 hover:text-gray-900"
//                 onClick={handleBackToInput}
//               >
//                 <RxCross2 />
//               </button>
//               <div className="text-3xl text-center">
//                 <h1>Available Drivers</h1>
//               </div>

//               {/* DRIVER LIST */}
//               {/* <DriverList /> */}
//               <div
//                 className="grid grid-cols-1 bg-gray-50 rounded-lg  lg:mt-5 gap-4 p-1 max-h-[310px] overflow-y-scroll "
//                 style={{ scrollbarWidth: 1, msOverflowStyle: "none" }}
//               >
//                 {driverList.length > 0 ? (
//                   driverList.map((driver, index) => (
//                     <div
//                       key={index}
//                       onClick={() => handleDriverClick(driver)}
//                       className="bg-gray-200 flex items-center border-2  justify-between gap-4 rounded-3xl w-full  p-3 cursor-pointer hover:bg-green-100"
//                     >
//                       <div className="flex items-center gap-4 ">
//                         <div className="">
//                           {driver.vehicle.trim().toLowerCase() === "car" && (
//                             <FaCar className="text-3xl" />
//                           )}
//                           {driver.vehicle.trim().toLowerCase() === "bus" && (
//                             <FaBus className="text-3xl" />
//                           )}
//                           {driver.vehicle.trim().toLowerCase() === "bike" && (
//                             <FaMotorcycle className="text-3xl" />
//                           )}
//                         </div>
//                         <div>
//                           <h2 className="text-xl font-bold">{driver.name}</h2>
//                           <p>
//                             <strong>Seats:</strong> {driver.seats}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <h2>
//                           <p className="text-lg font-semibold">
//                             Rs {driver.fare}
//                           </p>
//                         </h2>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="justify-center text-2xl">
//                     <p>No drivers found</p>
//                   </div>
//                 )}
//               </div>
//               <div className="h-auto justify-center ">
//                 <button
//                   onClick={handleBookRide}
//                   disabled={!selectedDriver}
//                   className="p-3 w-full justify-center bg-green-500 hover:bg-green-600 "
//                 >
//                   Book
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Rider;





// import { useRef, useState } from "react";
// import L from "leaflet";
// import MapComponent from "./MapComponent";
// import LocationInput from "./LocationInput";
// import DriverList from "./DriverList";

// const Rider = () => {
//   const [showDriverList, setShowDriverList] = useState(false);
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");
//   const [pickupCoords, setPickupCoords] = useState(null);
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [driverList, setDriverList] = useState([]);
//   const [suggestions, setSuggestions] = useState({ pickup: [], destination: [] });

//   const mapRef = useRef(null);
//   const routingControlRef = useRef(null);
//   const markersRef = useRef([]);

//   // API Calls
//   const getCoordinates = async (address) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`
//       );
//       const data = await response.json();
//       return data[0] ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       return null;
//     }
//   };

//   const fetchSuggestions = async (query, field) => {
//     if (query.length < 3) return;
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`
//       );
//       const data = await response.json();
//       const formattedSuggestions = data.map(item => ({
//         label: item.display_name,
//         latLng: [item.lat, item.lon]
//       }));
//       setSuggestions(prev => ({ ...prev, [field]: formattedSuggestions }));
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//     }
//   };

//   const findDrivers = async () => {
//     const [pickup, destination] = await Promise.all([
//       getCoordinates(pickupLocation),
//       getCoordinates(destinationLocation)
//     ]);

//     if (!pickup || !destination) return;

//     setPickupCoords(pickup);
//     setDestinationCoords(destination);

//     const riderData = {
//       pickupCoords: [pickup[1], pickup[0]],
//       destinationCoords: [destination[1], destination[0]]
//     };

//     try {
//       const response = await fetch("http://localhost:5000/match-drivers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(riderData)
//       });
//       const data = await response.json();
//       if (response.ok) setDriverList(data.drivers);
//     } catch (error) {
//       console.error("Error finding drivers:", error);
//     }
//     setShowDriverList(true);
//   };

//   // Event Handlers
//   const handleDriverClick = (driver) => {
//     const { startLocation, destinationLocation } = driver;

//     Promise.all([
//       L.Control.Geocoder.nominatim().geocode(startLocation),
//       L.Control.Geocoder.nominatim().geocode(destinationLocation)
//     ]).then(([pickupResults, destinationResults]) => {
//       if (pickupResults[0] && destinationResults[0]) {
//         const pickupLatLng = pickupResults[0].center;
//         const destinationLatLng = destinationResults[0].center;

//         routingControlRef.current.setWaypoints([
//           L.latLng(pickupLatLng.lat, pickupLatLng.lng),
//           L.latLng(destinationLatLng.lat, destinationLatLng.lng)
//         ]);

//         const map = mapRef.current;
//         map.fitBounds([[pickupLatLng.lat, pickupLatLng.lng], [destinationLatLng.lat, destinationLatLng.lng]]);

//         markersRef.current.forEach(marker => marker.remove());
//         markersRef.current = [
//           L.marker(pickupLatLng).addTo(map).bindPopup(`Pickup: ${pickupResults[0].name}`).openPopup(),
//           L.marker(destinationLatLng).addTo(map).bindPopup(`Destination: ${destinationResults[0].name}`).openPopup()
//         ];
//       }
//     }).catch(() => alert("Could not find one of the locations."));
//   };

//   const resetMap = () => {
//     markersRef.current.forEach(marker => marker.remove());
//     markersRef.current = [];
//     routingControlRef.current.setWaypoints([]);
//     setPickupLocation("");
//     setDestinationLocation("");
//     setSuggestions({ pickup: [], destination: [] });
//     setShowDriverList(false);
//   };

//   const handleSuggestionClick = (suggestion, field) => {
//     const setter = field === "pickup" ? setPickupLocation : setDestinationLocation;
//     setter(suggestion.label);
//     setSuggestions(prev => ({ ...prev, [field]: [] }));
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <div className="flex flex-col lg:flex-row w-full gap-4 p-4 h-[calc(100vh-64px)]">
//         <MapComponent mapRef={mapRef} routingControlRef={routingControlRef} />

//         <div className="w-full lg:w-1/2 h-auto lg:h-full flex flex-col rounded-lg shadow-lg p-4 bg-white">
//           {!showDriverList ? (
//             <div className="flex flex-col gap-4 h-full">
//               <div className="flex flex-col gap-4">
//                 <LocationInput
//                   value={pickupLocation}
//                   onChange={(e) => {
//                     setPickupLocation(e.target.value);
//                     fetchSuggestions(e.target.value, "pickup");
//                   }}
//                   suggestions={suggestions.pickup}
//                   onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, "pickup")}
//                   onReset={() => setPickupLocation("")}
//                   placeholder="Enter pickup location"
//                 />
//                 <LocationInput
//                   value={destinationLocation}
//                   onChange={(e) => {
//                     setDestinationLocation(e.target.value);
//                     fetchSuggestions(e.target.value, "destination");
//                   }}
//                   suggestions={suggestions.destination}
//                   onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, "destination")}
//                   onReset={() => setDestinationLocation("")}
//                   placeholder="Enter destination location"
//                 />
//               </div>
//               <div className="flex gap-4">
//                 <button
//                   onClick={findDrivers}
//                   className="bg-blue-600 text-white p-2 rounded-lg hover:scale-105 transition-transform flex-1"
//                 >
//                   Find Drivers
//                 </button>
//                 <button
//                   onClick={resetMap}
//                   className="bg-red-600 text-white p-2 rounded-lg hover:scale-105 transition-transform flex-1"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <DriverList
//               drivers={driverList}
//               onDriverClick={handleDriverClick}
//               onClose={() => setShowDriverList(false)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Rider;
