/* eslint-disable react/prop-types */
import { FaCar, FaBus, FaMotorcycle } from "react-icons/fa";

const DriverCard = ({ driver, onClick }) => {
  const vehicleIcons = {
    car: <FaCar className="text-3xl" />,
    bus: <FaBus className="text-3xl" />,
    bike: <FaMotorcycle className="text-3xl" />
  };

  return (
    <div
      onClick={() => onClick(driver)}
      className="bg-gray-200 flex items-center justify-between gap-4 rounded-3xl w-full shadow-md p-3 cursor-pointer hover:bg-slate-100"
    >
      <div className="flex items-center gap-4">
        <div>{vehicleIcons[driver.vehicle.toLowerCase().trim()]}</div>
        <div>
          <h2 className="text-xl font-bold">{driver.name}</h2>
          <p><strong>Seats:</strong> {driver.seats}</p>
        </div>
      </div>
      <p className="text-lg font-semibold">Rs {driver.fare}</p>
    </div>
  );
};

export default DriverCard;