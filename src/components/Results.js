import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import "../index.css";
import description from "./materialDescription";

export default function Results(props) {
  const recyclableClasses = ["Cardboard", "Glass", "Metal", "Paper"];
  const unrecyclableClasses = ["trash"];

  const [prediction, setPrediction] = useState();
  const [recyclable, setRecyclable] = useState();
  const [notRecyclable, setNotRecyclable] = useState();
  const [resinCode, setResinCode] = useState("");

  useEffect(() => {
    if (props.image) {
      sendImageToBackend();
    }
  }, [props.image]);

  const handleChange = (event) => {
    setResinCode(event.target.value);
  };

  const sendImageToBackend = async () => {
    try {
      // Convert image to FormData
      const formData = new FormData();
      formData.append("image", props.image, props.image.name);

      // Send POST request to backend
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPrediction(result);
        if (recyclableClasses.includes(result)) {
          setRecyclable(true);
        } else if (result === "Plastic") {
          console.log("plastic");
        } else {
          setNotRecyclable(true);
        }
      } else {
        console.error("Error processing image:", response.statusText);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <Box
      sx={{
        justifyContent: "center",
        display: "flex",
        height: "100vh",
      }}
    >
      <Box
        width={"600px"}
        className="center-alignment-column"
        sx={{
          backgroundColor: "#F2FFFF",
        }}
      >
        <Grid container className="center-alignment-row-mobile">
          <Grid item xs={3}>
            <Link to="/">
              <img src="/con.png" alt="CoN logo" width="90%" />
            </Link>
          </Grid>
          <Grid item xs={9}>
            <b>Uncertain about an item's recyclability?</b>
            <p>Snap a picture and upload it here for quick identification</p>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={URL.createObjectURL(props.image)}
            alt="uploaded_img"
            width="50%"
          />
          <Typography variant="h4" sx={{ marginTop: "20px" }}>
            {prediction}
          </Typography>
          {description.map((item, index) => {
            if (item.material === prediction && item.material === "Plastic") {
              return (
                <>
                  <Box
                    key={index}
                    sx={{
                      marginTop: "20px",
                      padding: "20px",
                      backgroundColor: "#F2FFFF",
                      borderRadius: "10px",
                    }}
                  >
                    <Typography>{item.description}</Typography>
                    {item.additional && (
                      <Typography>{item.additional}</Typography>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Resin Code
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={resinCode}
                        label="Age"
                        onChange={handleChange}
                      >
                        <MenuItem value={1}>PVC</MenuItem>
                        <MenuItem value={2}>PPDE</MenuItem>
                        <MenuItem value={3}>HPDE</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </>
              );
            } else if (item.material === prediction) {
              return (
                <Box
                  key={index}
                  sx={{
                    marginTop: "20px",
                    padding: "20px",
                    backgroundColor: "#F2FFFF",
                    borderRadius: "10px",
                  }}
                >
                  <Typography>{item.description}</Typography>
                </Box>
              );
            } else {
              return null;
            }
          })}
          {recyclable && <Typography variant="h4">Can recycle!</Typography>}
          {notRecyclable && (
            <Typography variant="h4">Cannot recycle!</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
