import * as React from "react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

function Home() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [isTopicSelected, setIsTopicSelected] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getTweets = async (topic, date) => {
    try {
      const url = new URL("http://localhost:5000/get_tweets");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, date }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // TODO: Parse the response JSON.
      console.log("Data sent to frontend", data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error receiving data from backend:", error);
      setIsLoading(false);
      return null;
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const searchData = await getTweets(topic, date);
    if (searchData != null) {
      console.log("searchData is null.");
    }
    if (searchData) {
      navigate(`/results?query=${topic}&date=${date}`, { searchData });
    }
  };

  const checkButtonDisabled = () => {
    setIsTopicSelected(topic.trim() !== "");
    setIsDateSelected(date !== "");
  };

  React.useEffect(() => {
    checkButtonDisabled();
  }, [topic, date]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CHARm</h1>
        <Paper
          component="form"
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            width: 600,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <InputBase
            sx={{ flex: 1 }}
            placeholder="Search Topic"
            inputProps={{ "aria-label": "search topic" }}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Box sx={{ minWidth: 120, marginLeft: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Date</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={date}
                label="Date"
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(e.target.value);
                  setIsDateSelected(true);
                }}
              >
                <MenuItem value={1}>1 Month Ago</MenuItem>
                <MenuItem value={2}>3 Months Ago</MenuItem>
                <MenuItem value={3}>6 Months Ago</MenuItem>
                <MenuItem value={4}>1 Year Ago</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!isTopicSelected || !isDateSelected}
            loading={isLoading}
            sx={{
              marginLeft: 2,
              height: "100%",
            }}
          >
            Search
          </LoadingButton>
        </Paper>
      </header>
    </div>
  );
}

export default Home;
