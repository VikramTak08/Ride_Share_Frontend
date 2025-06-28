/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";

const LocationInput = ({ value, onChange, suggestions, onSuggestionClick, onReset, placeholder }) => (
  <div className="relative z-20">
    <input
      type="text"
      className="border bg-gray-200 rounded-lg p-2 pr-10 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <RxCross2
      onClick={onReset}
      className="absolute top-1/2 cursor-pointer right-3 text-xl transform -translate-y-1/2 text-gray-600"
    />
    {suggestions.length > 0 && (
      <ul className="absolute top-full left-0 bg-white shadow-lg w-full z-30 max-h-40 overflow-y-auto">
        {suggestions.map((suggestion, idx) => (
          <li
            key={idx}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion.label}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default LocationInput;