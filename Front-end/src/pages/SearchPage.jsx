import React, { useState, useEffect, useRef } from "react";
import { useDataStore } from "../store/dataStore";
import Navbar from "../components/Navbar";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [editingCell, setEditingCell] = useState({});

  const tableRef = useRef(); // Ref for the table to detect clicks outside

 
  const {
    searchResults,
    fetchSearchResults,
    updateRecord,
    isLoading,
    pagination,
  } = useDataStore();

  
  useEffect(() => {
    fetchSearchResults(searchQuery, pagination.currentPage, pagination.itemsPerPage);
  }, [searchQuery, pagination.currentPage]);

 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setEditingCell({});
  };

  // Handle editing state
  const handleEdit = (rowId, fieldName, value) => {
    setEditingCell({ rowId, fieldName, value: value ?? "" }); // Initialize value to empty string if null/undefined
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
      setEditingCell({}); // Exit editable mode
    }
  };

  // Add event listener to detect clicks outside the table
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
        <h1 className="text-2xl font-bold mb-4">Search and Edit</h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter search query..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-700"
          />
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
              fetchSearchResults(searchQuery, pagination.currentPage - 1, pagination.itemsPerPage)
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
              fetchSearchResults(searchQuery, pagination.currentPage + 1, pagination.itemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
