import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Home.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const selectedDate = queryParams.get("date");
  const [searchData, setSearchData] = useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetch(`http://localhost:5000`)
    .then((response) => response.json())
    .then((data) => {
      setSearchData(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);
  

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "absolute",
            top: "100px",
            left: "300px",
          }}
        >
          <IconButton
            aria-label="back"
            onClick={handleGoBack}
            size="large"
            style={{
              color: "white",
              transition: "color 0.3s",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        <h2>{query}</h2>
        <p>Search Query: {query}</p>
        <p>Selected Date: {selectedDate}</p>
        {searchData && (
          <>
          <h3>Sentiment Analysis Results:</h3>
          <pre>{JSON.stringify(searchData.sentiment_results, null, 2)}</pre>
          </>
        )}
      </header>
    </div>
  );
};

export default Results;
