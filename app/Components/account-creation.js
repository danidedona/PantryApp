import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Link,
} from "@mui/material";
import { addUser } from "../Utils/add-user";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import logo from "../Images/ThePantry.png";

/**
 * The authing setStateAction is passed in by the AuthRoute class to switch to logged in mode after account is created.
 * @param {Object} props - The props for the component.
 * @param {Function} props.setAuthing - The function to set the authentication state.
 * @param {string} props.UID - The UID of the authenticated user.
 */
const AccountCreation = ({ setAuthing, UID }) => {
  const [name, setName] = useState("");
  const [creation_date, setCreation_date] = useState("");

  const theme = useTheme();

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setCreation_date(today);
  }, []);

  const handleClick = () => {
    console.log("Attempting to save user:", name);
    console.log("UID in handleClick:", UID); // Add console log

    addUser(UID, name, creation_date) // Use the UID from props
      .then(() => {
        console.log("User saved successfully");
        setAuthing(1); // Successfully created the user account
      })
      .catch((error) => {
        console.error("Error saving user:", error);
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      paddingTop={4}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxWidth="400px"
        margin="auto"
        padding={3}
        border={1}
        borderColor="divider"
        borderRadius={2}
        boxShadow={3}
        bgcolor="background.paper"
        marginTop="11rem" // Add this to create a gap at the top
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection="row"
          width="100%"
          height={"50px"}
        >
          <Box
            sx={{
              position: "relative",
              top: "-5px", // Adjust vertical position of logo
              left: "-20px", // Adjust horizontal position of logo
            }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={80}
              height={"auto"}
              style={{ objectFit: "contain" }} // Ensure the logo fits within the dimensions
            />
          </Box>
          <Typography
            variant="h6"
            component="h1"
            gutterBottom
            paddingLeft={2}
            sx={{
              position: "relative",
              top: "0px", // Adjust vertical position of text
              left: "-40px", // Adjust horizontal position of text
              fontSize: "1rem", // Adjust font size (e.g., 1rem for smaller text)
            }}
          >
            Pantry Tracker
          </Typography>
        </Box>
        <Divider sx={{ width: "100%", marginY: 2 }} /> {/* Horizontal line */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          marginTop={2}
          style={{
            fontWeight: 700, // Adjust thickness (font weight), 400 is normal, 700 is bold
          }}
        >
          Create Account
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Creation Date"
          variant="outlined"
          value={creation_date}
          onChange={(e) => setCreation_date(e.target.value)}
          fullWidth
          margin="normal"
          disabled
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          fullWidth // Makes the button full width
          style={{
            marginTop: "1rem",
            borderRadius: "20px",
            marginBottom: "1rem",
          }} // Rounded button
        >
          Create Account
        </Button>
      </Box>
    </Box>
  );
};

export default AccountCreation;
