import React, { useState, useEffect, useRef } from "react";
import { useDataStore } from "../store/dataStore";
import Navbar from "../components/Navbar";

const FilterPage = () => {
  const [filters, setFilters] = useState({
    wordFirstLang: "",
    wordSecondLang: "",
    sentenceFirstLang: "",
    sentenceSecondLang: "",
    id: "",
  }); 
  const [editingCell, setEditingCell] = useState({}); 

  const tableRef = useRef(); 

  
  const {
    searchResults,
    fetchFilteredResults,
    updateRecord,
    isLoading,
    pagination,
  } = useDataStore();

 
  useEffect(() => {
    fetchFilteredResults(filters, pagination.currentPage, pagination.itemsPerPage);
  }, [filters, pagination.currentPage]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setEditingCell({}); 
  };

  
  const handleEdit = (rowId, fieldName, value) => {
    setEditingCell({ rowId, fieldName, value: value ?? "" }); 
  };

  
  const handleUpdate = async (rowId) => {
    const { fieldName, value } = editingCell;

    if (!fieldName || value === undefined) return;

    
    const updatedData = {
      [fieldName]: value,
    };

    await updateRecord(rowId, updatedData); 
    setEditingCell({}); 
  };

  
  const handleClickOutside = (e) => {
    if (tableRef.current && !tableRef.current.contains(e.target)) {
      setEditingCell({}); 
    }
  };

 
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Navbar */}
      <div className="bg-orange-600 text-white p-4">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md p-4 mt-4">
        <h1 className="text-2xl font-bold mb-4">Filter and Edit</h1>

        {/* Filter Form */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="wordFirstLang" className="block mb-1 font-semibold">
              Word (Lang 1)
            </label>
            <input
              id="wordFirstLang"
              type="text"
              name="wordFirstLang"
              placeholder="Enter Word (Lang 1)"
              value={filters.wordFirstLang}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="wordSecondLang" className="block mb-1 font-semibold">
              Word (Lang 2)
            </label>
            <input
              id="wordSecondLang"
              type="text"
              name="wordSecondLang"
              placeholder="Enter Word (Lang 2)"
              value={filters.wordSecondLang}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="sentenceFirstLang" className="block mb-1 font-semibold">
              Sentence (Lang 1)
            </label>
            <input
              id="sentenceFirstLang"
              type="text"
              name="sentenceFirstLang"
              placeholder="Enter Sentence (Lang 1)"
              value={filters.sentenceFirstLang}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="sentenceSecondLang" className="block mb-1 font-semibold">
              Sentence (Lang 2)
            </label>
            <input
              id="sentenceSecondLang"
              type="text"
              name="sentenceSecondLang"
              placeholder="Enter Sentence (Lang 2)"
              value={filters.sentenceSecondLang}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="id" className="block mb-1 font-semibold">
              ID
            </label>
            <input
              id="id"
              type="text"
              name="id"
              placeholder="Enter ID"
              value={filters.id}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(100vh-250px)]">
          <table
            ref={tableRef}
            className="table-auto w-full border-collapse border border-gray-300"
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Word (Lang 1)</th>
                <th className="border border-gray-300 p-2">Sentence (Lang 1)</th>
                <th className="border border-gray-300 p-2">Word (Lang 2)</th>
                <th className="border border-gray-300 p-2">Sentence (Lang 2)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? (
                searchResults.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-gray-300 p-2">{row.id}</td>
                    {[
                      "wordFirstLang",
                      "sentenceFirstLang",
                      "wordSecondLang",
                      "sentenceSecondLang",
                    ].map((field) => (
                      <td
                        key={field}
                        className="border border-gray-300 p-2 cursor-pointer"
                        onDoubleClick={() => handleEdit(row.id, field, row[field] || "")} // Double-click triggers edit mode
                      >
                        {editingCell.rowId === row.id && editingCell.fieldName === field ? (
                          <input
                            type="text"
                            value={editingCell.value ?? ""}
                            onChange={(e) => handleEdit(row.id, field, e.target.value)}
                            className="p-2 border rounded w-full"
                            placeholder="(empty)"
                          />
                        ) : (
                          <span>{row[field] ?? "(empty)"}</span> // Display placeholder for empty values
                        )}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleUpdate(row.id)}
                        disabled={!editingCell.rowId || editingCell.rowId !== row.id}
                        className={`p-1 ${
                          editingCell.rowId === row.id
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        } rounded`}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-center items-center space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={pagination.currentPage === 1 || isLoading}
            onClick={() =>
              fetchFilteredResults(filters, pagination.currentPage - 1, pagination.itemsPerPage)
            }
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={pagination.currentPage === pagination.totalPages || isLoading}
            onClick={() =>
              fetchFilteredResults(filters, pagination.currentPage + 1, pagination.itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
