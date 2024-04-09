import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

import SwipeableViews from "react-swipeable-views-react-18-fix";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Confetti from "react-confetti";

import "../index.css";
import description from "./materialDescription";

export default function Results(props) {
  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 14,
      },
      subtitle2: {
        fontSize: 16,
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

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
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
      setRecyclable(true);
      setNotRecyclable(false);
    } else if (event.target.value === 2) {
      setRecyclable(true);
      setNotRecyclable(false);
    } else if (event.target.value === 3) {
      setNotRecyclable(true);
      setRecyclable(false);
    } else if (event.target.value === 4) {
      setRecyclable(true);
      setNotRecyclable(false);
    } else if (event.target.value === 5) {
      setRecyclable(true);
      setNotRecyclable(false);
    } else if (event.target.value === 6) {
      setNotRecyclable(true);
      setRecyclable(false);
    } else if (event.target.value === 7) {
      setNotRecyclable(true);
      setRecyclable(false);
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
          width={"450px"}
          className="center-alignment-column"
          sx={{
            backgroundColor: "#F2FFFF",
          }}
        >
          {/* {recyclable && <Confetti width={"auto"} recycle={false} />} */}

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
            <Typography
              variant="h4"
              sx={{ marginTop: "10px", marginBottom: "20px" }}
            >
              {prediction}
            </Typography>
            {recyclable && (
              <Typography variant="poster1">CAN RECYCLE!</Typography>
            )}
            {notRecyclable && (
              <Typography variant="poster2">CANNOT RECYCLE!</Typography>
            )}

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
                        variant="subtitle2"
                        sx={{ marginBottom: "25px" }}
                      >
                        But, do you know: <br />
                        Not all types of plastic are recyclable!
                      </Typography>
                      <Typography
                        variant="subtitle1"
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
                          <MenuItem value={1}>PETE</MenuItem>
                          <MenuItem value={2}>HPDE</MenuItem>
                          <MenuItem value={3}>V</MenuItem>
                          <MenuItem value={4}>LDPE</MenuItem>
                          <MenuItem value={5}>PP</MenuItem>
                          <MenuItem value={6}>PS</MenuItem>
                          <MenuItem value={7}>OTHER</MenuItem>
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
                      borderRadius: "10px",
                    }}
                  >
                    <Typography variant="subtitle2">Do you know:</Typography>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={activeStep}
                      onChangeIndex={handleStepChange}
                      enableMouseEvents
                    >
                      {item.description.map((item2, index2) => (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          key={index2}
                        >
                          {Math.abs(activeStep - index2) <= 2 ? (
                            <Card sx={{ maxWidth: 360, marginBottom: "20px" }}>
                              <CardContent>
                                <Typography variant="subtitle1">
                                  {item2}
                                </Typography>
                              </CardContent>
                            </Card>
                          ) : null}
                        </Box>
                      ))}
                    </SwipeableViews>
                    <MobileStepper
                      steps={item.description.length}
                      position="static"
                      activeStep={activeStep}
                      nextButton={
                        <Button
                          size="small"
                          onClick={handleNext}
                          disabled={activeStep === item.description.length - 1}
                        >
                          Next
                          {theme.direction === "rtl" ? (
                            <KeyboardArrowLeft />
                          ) : (
                            <KeyboardArrowRight />
                          )}
                        </Button>
                      }
                      backButton={
                        <Button
                          size="small"
                          onClick={handleBack}
                          disabled={activeStep === 0}
                        >
                          {theme.direction === "rtl" ? (
                            <KeyboardArrowRight />
                          ) : (
                            <KeyboardArrowLeft />
                          )}
                          Back
                        </Button>
                      }
                    />
                    <Typography variant="subtitle1">
                      {item.additional}
                    </Typography>
                  </Box>
                );
              } else {
                return null;
              }
            })}
          </Box>
          {prediction ? (
            <Link to="/">
              <Button
                component="label"
                variant="contained"
                sx={{ marginTop: "25px" }}
              >
                Check another item!
              </Button>
            </Link>
          ) : (
            <Box marginTop="20px">
              <Typography variant="subtitle2">
                This item Can or Not...?
              </Typography>
              <Typography variant="subtitle1" marginBottom="20px">
                Let's find out!
              </Typography>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
