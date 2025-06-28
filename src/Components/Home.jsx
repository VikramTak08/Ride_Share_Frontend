
 



import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "./Footer";
import { useState, useEffect } from "react"; // Added for local state management
import { FaCar } from "react-icons/fa"; // Icon for the ride card

const Home = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  //console.log("user id :",user.sub);
  // Local state to manage ride status (replace with global state/context in a real app)
  const [rideStatus, setRideStatus] = useState(null);

  // Simulate ride booking status (in a real app, this would come from a context or backend)
  useEffect(() => {
    // For demo purposes, check localStorage or a prop/context for ride status
    const storedRide = localStorage.getItem("rideStatus");
    if (storedRide) {
      setRideStatus(JSON.parse(storedRide));
    }

    // Cleanup: Remove ride status from localStorage when component unmounts or ride is canceled
    return () => {
      // Optionally handle cleanup here if needed
    };
  }, []);

  // Simulate ride booking (replace with actual booking logic from Rider component)
  // eslint-disable-next-line no-unused-vars
  const simulateRideBooking = (driver) => {
    const rideData = {
      driverName: driver.name,
      fare: driver.fare,
      vehicle: driver.vehicle,
    };
    setRideStatus(rideData);
    localStorage.setItem("rideStatus", JSON.stringify(rideData));
  };

  // Handle ride cancellation
  const handleCancelRide = () => {
    setRideStatus(null);
    localStorage.removeItem("rideStatus");
  };

  // Navigate to Status page
  const handleCardClick = () => {
    if (rideStatus) {
      navigate("/driver-status", { state: { driver: { name: rideStatus.driverName, fare: rideStatus.fare, vehicle: rideStatus.vehicle } } });
    }
  };

  return (
    <>
      <div className="min-h-screen p-4 pb-8 pt-20 bg-gray-100">
        {isAuthenticated && (
          <div>
            <h1 className="text-3xl font-serif">
              Welcome, <span>{user.nickname}</span>
            </h1>
          </div>
        )}

        {/* Ride Status Card */}
        {rideStatus && (
          <div
            onClick={handleCardClick}
            className="fixed bottom-40 right-4 w-45 sm:w-45 md:w-96 bg-white rounded-xl shadow-2xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl z-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaCar className="text-blue-600 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Ride with {rideStatus.driverName}
                </h3>
                <p className="text-sm text-gray-600">
                  {rideStatus.vehicle} • Rs {rideStatus.fare}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">En Route</p>
              </div>
            </div>
            {/* Cancel Button (optional inline cancel) */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from triggering
                if (window.confirm("Cancel this ride?")) handleCancelRide();
              }}
              className="mt-3 w-full bg-red-100 text-red-600 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
            >
              Cancel Ride
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="container mt-5 mx-auto flex flex-col md:flex-row gap-6 md:items-center">
          {/* Driver Card */}
          <div className="flex-1 shadow-lg rounded-xl overflow-hidden bg-gray-200 text-black flex flex-col sm:flex-row justify-center items-center transform transition-all duration-300 hover:shadow-xl">
            <img src="car.png" alt="Driver" className="w-24 h-24 object-cover" />
            <div className="p-6 text-center sm:text-left">
              <h1 className="text-2xl font-semibold mb-2">For Driver</h1>
              <p className="mb-4 text-gray-700">
                Become a part of our driving community. Offer rides and earn money while helping people get to their destinations.
              </p>
              <hr className="border-gray-400 mb-4" />
              <button
                onClick={() => navigate("/driver")}
                className="bg-pink-700 text-white py-2 px-6 rounded-3xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
              >
                Start
              </button>
            </div>
          </div>

          {/* Rider Card */}
          <div className="flex-1 shadow-lg rounded-xl overflow-hidden bg-gray-200 text-black flex flex-col sm:flex-row justify-center items-center transform transition-all duration-300 hover:shadow-xl">
            <img src="rider.png" alt="Rider" className="w-24 h-24 object-cover" />
            <div className="p-6 text-center sm:text-left">
              <h1 className="text-2xl font-semibold mb-2">For Rider</h1>
              <p className="mb-4 text-gray-700">
                Find rides quickly and easily. Connect with drivers near you and enjoy a comfortable journey to your destination.
              </p>
              <hr className="border-gray-400 mb-4" />
              <button
                onClick={() => navigate("/rider")}
                className="bg-pink-700 text-white py-2 px-6 rounded-3xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;