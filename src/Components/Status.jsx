/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaCreditCard, FaMobileAlt } from "react-icons/fa"; // Icons for payment options

const Status = () => {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const driver = location.state?.driver;
  const [selectedPayment, setSelectedPayment] = useState("Cash"); // Default payment method

  useEffect(() => {
    if (!driver) {
      navigate("/rider");
      return;
    }

    const map = L.map(mapRef.current).setView([23.215, 77.415], 15);
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution =
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(map);

    // Simulate live tracking (replace with real-time data in production)
    const driverMarker = L.marker([23.215, 77.415])
      .addTo(map)
      .bindPopup(`${driver.name}'s Location`)
      .openPopup();

    // Cleanup
    return () => map.remove();
  }, [driver, navigate]);

  const handleCancelRide = () => {
    if (window.confirm("Are you sure you want to cancel the ride?")) {
      localStorage.removeItem("rideStatus"); // Clear ride status
      navigate("/rider");
    }
  };

  const paymentOptions = [
    { id: "Cash", label: "Cash", icon: <FaMoneyBillWave className="text-xl" /> },
    { id: "Card", label: "Credit/Debit Card", icon: <FaCreditCard className="text-xl" /> },
    { id: "UPI", label: "UPI", icon: <FaMobileAlt className="text-xl" /> },
  ];

  const handlePaymentSelect = (option) => {
    setSelectedPayment(option);
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 font-sans">
      {/* Header Spacer */}
      <div className="h-[52px]"></div>

      {/* Main Container */}
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Map Section */}
        <div
          ref={mapRef}
          className="h-96 w-full rounded-2xl shadow-xl border border-gray-300 overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
        />

        {/* Driver Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {driver.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{driver.name}</h2>
                <p className="text-sm text-gray-500">Your Driver</p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              En Route
            </span>
          </div>

          {/* Driver Details */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-medium">Vehicle</p>
              <p className="text-lg text-gray-800">{driver.vehicle}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Seats</p>
              <p className="text-lg text-gray-800">{driver.seats}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
            <div className="flex justify-between mb-4">
              <p className="text-gray-600">Total Fare</p>
              <p className="text-lg font-bold text-gray-800">Rs {driver.fare}</p>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handlePaymentSelect(option.id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all duration-200 ${
                    selectedPayment === option.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        selectedPayment === option.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <span className="text-gray-800 font-medium">{option.label}</span>
                  </div>
                  {selectedPayment === option.id && (
                    <span className="text-blue-500 font-semibold">Selected</span>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Payment Confirmation */}
            <p className="mt-3 text-gray-600">
              Payment Method: <span className="font-medium text-gray-800">{selectedPayment}</span>
            </p>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleCancelRide}
            className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg font-medium shadow-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Cancel Ride
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
          <p className="text-gray-600">
            Estimated Arrival: <span className="font-semibold">5-10 mins</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Contact driver if needed: +91-XXX-XXX-XXXX
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;