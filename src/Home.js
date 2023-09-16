import * as React from "react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [isTopicSelected, setIsTopicSelected] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    // Perform your search logic here
    // For example, you can fetch search results from an API

    // After performing the search, navigate to the Results page with props
    navigate(`/results?query=${topic}&date=${date}`);
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!isTopicSelected || !isDateSelected}
            sx={{
              marginLeft: 2,
              height: "100%",
            }}
          >
            Search
          </Button>
        </Paper>
      </header>
    </div>
  );
}

export default Home;
