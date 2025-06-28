/* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaCar, FaBus, FaMotorcycle } from "react-icons/fa";

// const DriverList = () => {
//   const [drivers, setDrivers] = useState([]);

//   useEffect(() => {
//     // Fetch drivers data from backend
//     const fetchDrivers = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/drivers");
//         setDrivers(response.data);
//       } catch (error) {
//         console.error("Error fetching drivers:", error);
//       }
//     };

//     fetchDrivers();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 bg-gray-50 rounded-lg  lg:mt-5 gap-4 p-1 max-h-[380px] overflow-y-scroll " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
       
//       {drivers.map((driver) => (
//         <div
//           key={driver._id}
//           className="bg-gray-200 flex items-center justify-between gap-4 rounded-3xl w-full shadow-md p-3"
//         >
           
//           <div className="flex items-center gap-4">
//             <div className="">
              
//               {driver.vehicle.trim().toLowerCase() === "car" && (
//                 <FaCar className="text-3xl" />
//               )}
//               {driver.vehicle.trim().toLowerCase() === "bus" && (
//                 <FaBus className="text-3xl" />
//               )}
//               {driver.vehicle.trim().toLowerCase() === "bike" && (
//                 <FaMotorcycle className="text-3xl" />
//               )}
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">{driver.name}</h2>
//               <p>
//                 <strong>Seats:</strong> {driver.seats}
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//            <h2><p className="text-lg font-semibold">Rs {driver.fare}</p></h2> 
//           </div>
//         </div>
//       ))}
//     </div>
//      );
//     };
    
//     export default DriverList;

//     // <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:mt-11  gap-4 p-6 max-h-30 overflow-y-scroll ">
//     //     {drivers.map(driver => (
//     //         <div key={driver._id} className=" bg-gray-200 flex flex-row gap-20  rounded shadow-md">
//     //             <div>

//     //             <h2 className="text-xl font-bold">{driver.name}</h2>
//     //             {/* <p><strong>Phone No:</strong> {driver.phone}</p> */}
//     //             {/* <p><strong>Current Location:</strong> {driver.startLocation}</p>
//     //             <p><strong>Destination:</strong> {driver.destinationLocation}</p> */}
//     //             <p><h3>{driver.vehicle}</h3></p>
//     //             </div >
//     //             {/* <p><strong>Seats:</strong> {driver.seats}</p> */}

//     //             <div className='align-middle'><p><strong>Rs {driver.fare}</strong> </p></div>
//     //         </div>
//     //     ))}
//     // </div>
 

// // import { useEffect, useState } from "react";
// // import Cards from "./Cards";
// // import axios from "axios";

// // function Rider() {

// //   const [book, setBook] = useState([]);
// //   useEffect(() => {
// //     const getBook = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:4001/save-driver");
// //         console.log(res.data);
// //         setBook(res.data);
// //       } catch (error) {
// //         console.log(error);
// //       }
// //     };
// //     getBook();
// //   }, []);

// //   return (<>

// //     <div>Rider</div>
// //     <div className="mt-12 grid grid-cols-1 md:grid-cols-4">

// //     {book.map((item) => (

// //       <Cards key={item.id} item={item}/>

// //     ))}
// //   </div>
// //   </>
// //   )
// // }

// // export default Rider



import { RxCross2 } from "react-icons/rx";
import DriverCard from "./DriverCard";

const DriverList = ({ drivers, onDriverClick, onClose }) => (
  <div className="relative z-20 border border-gray-300 p-4 rounded max-h-[410px] bg-white">
    <button className="absolute top-5 right-5 text-3xl text-gray-700 hover:text-gray-900" onClick={onClose}>
      <RxCross2 />
    </button>
    <h1 className="text-3xl text-center mb-5">Available Drivers</h1>
    <div className="grid grid-cols-1 bg-gray-50 rounded-lg gap-4 p-1 max-h-[310px] overflow-y-scroll">
      {drivers.length > 0 ? (
        drivers.map((driver, index) => (
          <DriverCard key={index} driver={driver} onClick={onDriverClick} />
        ))
      ) : (
        <p className="text-2xl text-center">No drivers found</p>
      )}
    </div>
  </div>
);

export default DriverList;
