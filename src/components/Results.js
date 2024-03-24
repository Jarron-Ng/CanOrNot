import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

import "../index.css";

export default function Results(props) {
  const classes = ["cardboard", "glass", "metal", "paper", "plastic", "trash"];
  const [prediction, setPrediction] = useState();

  useEffect(() => {
    if (props.image) {
      sendImageToBackend();
    }
  }, [props.image]);

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
        </Box>
      </Box>
    </Box>
  );
}
