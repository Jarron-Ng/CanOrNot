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
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { motion } from "framer-motion";

import "../index.css";
import description from "./materialDescription";

export default function Results(props) {
  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
      },
      subtitle2: {
        fontSize: 14,
        fontWeight: 600,
      },
      h4: {
        fontWeight: 700,
        fontSize: 28,
        fontVariant: "small-caps",
      },
      poster1: {
        color: "#72c13a",
        fontSize: 32,
        fontFamily: "Copperplate, fantasy",
      },
      poster2: {
        color: "#ff3d3d",
        fontSize: 32,
        fontFamily: "Copperplate, fantasy",
      },
    },
  });

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
      const delay = 1 + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 },
        },
      };
    },
  };

  const recyclableClasses = ["Cardboard", "Glass", "Metal", "Paper"];
  const mapPredictionClass = {
    0: "Cardboard",
    1: "Glass",
    2: "Metal",
    3: "Paper",
  };

  const [prediction, setPrediction] = useState();
  const [recyclable, setRecyclable] = useState();
  const [notRecyclable, setNotRecyclable] = useState();
  const [plasticDetected, setPlasticDetected] = useState(false);
  const [resinCode, setResinCode] = useState("");

  useEffect(() => {
    sendImageToBackend();
  }, []);

  const handleChange = (event) => {
    setResinCode(event.target.value);
    if (event.target.value === 1) {
      setRecyclable(false);
      setNotRecyclable(true);
    } else if (event.target.value === 2) {
      setNotRecyclable(false);
      setRecyclable(true);
    } else if (event.target.value === 3) {
      setNotRecyclable(false);
      setRecyclable(true);
    }
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
        setPrediction(mapPredictionClass[result]);

        if (recyclableClasses.includes(mapPredictionClass[result])) {
          setRecyclable(true);
        }
        // if "4" is returned, model detected it is plastic
        else if (result === 4) {
          setPrediction("Plastic");
          setPlasticDetected(true);
        } else {
          setPrediction("Trash");
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          minHeight: "100vh",
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
            <Typography variant="h4" sx={{ marginTop: "10px" }}>
              {prediction}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ marginTop: "-20px" }}
            ></Typography>
            {description.map((item, index) => {
              if (item.material === prediction && plasticDetected) {
                /*  div for plastic resin code to render */
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
                      <Typography
                        variant="subtitle1"
                        sx={{ marginBottom: "25px" }}
                      >
                        But, do you know: <br />
                        Not all types of plastic are recyclable!
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ marginBottom: "25px" }}
                      >
                        Locate the resin code on your plastic object and select
                        below for more precise recyclability determination!
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 250, marginBottom: "25px" }}>
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
            {recyclable && (
              <Typography variant="poster1">CAN RECYCLE!</Typography>
            )}
            {notRecyclable && (
              <Typography variant="poster2">CANNOT RECYCLE!</Typography>
            )}
          </Box>
          {prediction ? (
            <Link to="/">
              <Button
                component="label"
                variant="contained"
                sx={{ marginTop: "25px" }}
              >
                Predict another item!
              </Button>
            </Link>
          ) : (
            "Loading..."
            // <motion.svg
            //   viewBox="0 0 150 150"
            //   initial="hidden"
            //   animate="visible"
            // >
            //   <motion.circle
            //     cx="75"
            //     cy="75"
            //     r="20"
            //     stroke="#ff0055"
            //     variants={draw}
            //     custom={4}
            //   />
            // </motion.svg>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
