import React from "react";
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

  const handleGoBack = () => {
    navigate(-1);
  };

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
        {/* // TODO: Add data visualizations & results from backend call */}
      </header>
    </div>
  );
};

export default Results;
