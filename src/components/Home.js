import React, { useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../index.css";

export default function Home(props) {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

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
        fontWeight: 500,
        fontSize: 28,
        fontVariant: "small-caps",
      },
    },
  });

  const [file, setFile] = useState();

  function handleChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
    props.setFile(e.target.files[0]);
  }

  function handleOnRemoveImage() {
    setFile((prev) => !prev);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          height: file ? "auto" : "100vh",
        }}
      >
        <Box
          width={"500px"}
          className="center-alignment-column"
          sx={{
            backgroundColor: "#F2FFFF",
          }}
        >
          <Box className="dynamic-logo">
            <img src="/con.png" alt="CoN logo" width="65%" />
          </Box>
          <Box className="center-alignment-column" width={"80%"} mb={2}>
            <Typography variant="subtitle2">
              Uncertain about an item's recyclability?
            </Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: "25px" }}>
              Snap a picture and upload it here for quick identification.
            </Typography>

            <Typography variant="subtitle1">
              Our AI-powered system analyses the image to determine if it's
              recylable, making sustainable choices effortless.
            </Typography>
          </Box>

          {file && (
            <Box
              mb={5}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <IconButton
                aria-label="delete image"
                style={{
                  color: "#aaa",
                }}
                onClick={() => handleOnRemoveImage()}
              >
                <CancelIcon />
              </IconButton>
              <img src={file} alt="uploaded" width="50%" />
            </Box>
          )}

          <Box mt={3}>
            {file ? (
              <Link to="/results">
                <Button
                  sx={{ marginBottom: "2rem" }}
                  component="label"
                  variant="contained"
                >
                  Can Or Not!
                </Button>
              </Link>
            ) : (
              <Button component="label" variant="contained">
                Upload an image!
                <VisuallyHiddenInput
                  accept=".png,.jpg,.jpeg"
                  type="file"
                  onChange={handleChange}
                />
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
