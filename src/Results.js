import React from "react";
import { useLocation } from "react-router-dom";
import "./Home.css";

const Results = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const selectedDate = queryParams.get("date");

  return (
    <div className="App">
      <header className="App-header">
        <h2>{query}</h2>
        <p>Search Query: {query}</p>
        <p>Selected Date: {selectedDate}</p>
        {/* Add code to fetch and display search results here */}
      </header>
    </div>
  );
};

export default Results;
