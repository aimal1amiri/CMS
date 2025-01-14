import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthenticationStore } from "../store/authStore.js"; 

const Navbar = () => {
  const { logout, isAuthenticated } = useAuthenticationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/signin");
  };

  return (
    <div className="items-center">
      <nav className="bg-orange-500 p-5 flex justify-between rounded">
        {/* Navigation Tabs */}
        <div className="flex space-x-4">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `text-white font-semibold px-4 py-2 rounded ${
                isActive ? "bg-orange-700" : "hover:bg-orange-600"
              }`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/filter"
            className={({ isActive }) =>
              `text-white font-semibold px-4 py-2 rounded ${
                isActive ? "bg-orange-700" : "hover:bg-orange-600"
              }`
            }
          >
            Filter
          </NavLink>
          <NavLink
            to="/populatedb"
            className={({ isActive }) =>
              `text-white font-semibold px-4 py-2 rounded ${
                isActive ? "bg-orange-700" : "hover:bg-orange-600"
              }`
            }
          >
            Populate DB
          </NavLink>
        </div>

        
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-500"
          >
            Sign Out
          </button>
        
      </nav>
    </div>
  );
};

export default Navbar;
