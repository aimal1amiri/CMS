import React, { useState } from "react";
import { useDataStore } from "../store/dataStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const PopulateDbPage = () => {
  const [jsonUrl, setJsonUrl] = useState("");
  const { populateDatabase, isLoading } = useDataStore();
  const navigate = useNavigate(); 

  const handlePopulate = async () => {
      
    if (!jsonUrl.trim().toLowerCase().endsWith(".json")) {
      
      toast.error("Please provide a valid JSON URL.")
      return;
    }

    await populateDatabase(jsonUrl);

  
    if (!isLoading) {
      
        navigate("/search");
     
    }
  };

  return (
    <div className="w-full">
        <Navbar className="top"/>
    <div className="min-h-screen items-center flex justify-center bg-gray-100 w-full">
        
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md ">
        <h1 className="text-2xl font-bold text-center mb-4">Populate Database</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter JSON URL"
            value={jsonUrl}
            onChange={(e) => setJsonUrl(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>
        <button
          onClick={handlePopulate}
          disabled={isLoading}
          className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded hover:bg-orange-500 disabled:opacity-50"
        >
          {isLoading ? "Populating..." : "Populate Database"}
        </button>
  
       
      </div>
    </div>
    </div>
  );
};

export default PopulateDbPage;
