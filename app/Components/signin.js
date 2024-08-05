import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addLoginCookie, removeLoginCookie } from "./../Utils/cookie";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Divider,
} from "@mui/material";
import Image from "next/image";
import logo from "../Images/ThePantry.png";

const Login = ({ setAuthing, setUser, setUID }) => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleClick();
      }
    };

    document.body.addEventListener("keypress", handleKeyPress);
    return () => {
      document.body.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const handleClick = async () => {
    let valid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");

    if (email === "") {
      setEmailError("Email is required");
      valid = false;
    }

    if (password === "") {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!valid) return;

    console.log("Attempting to sign in with email:", email);

    try {
      // Try to sign in first
      try {
        const signInResponse = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Sign in successful:", signInResponse);
        setUser(signInResponse.user);
        setUID(signInResponse.user.uid); // Set the UID
        setAuthing(1); // Signed in successfully
        addLoginCookie(signInResponse.user.uid);
      } catch (signInError) {
        console.error("Sign in error:", signInError);
        console.log("Sign in error code:", signInError.code);
        console.log("Sign in error message:", signInError.message);

        if (signInError.code === "auth/user-not-found")
          // User not found, create a new account
          console.log("User not found. Attempting to create a new account.");
        try {
          const createUserResponse = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("Account creation successful:", createUserResponse);
          setUser(createUserResponse.user);
          setUID(createUserResponse.user.uid); // Set the UID
          console.log("Account creation UID:", createUserResponse.user.uid);
          setAuthing(2); // Account created and signed in
          addLoginCookie(createUserResponse.user.uid);
        } catch (createUserError) {
          console.error("Error creating user:", createUserError);
          console.log("Create user error code:", createUserError.code);
          console.log("Create user error message:", createUserError.message);

          if (createUserError.code === "auth/invalid-email") {
            setEmailError("Invalid email format");
          } else if (createUserError.code === "auth/weak-password") {
            setPasswordError("Weak password");
          } else {
            setPasswordError("Error creating account. Please try again.");
          }
          setAuthing(0); // Error occurred
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      console.log("Unexpected error message:", error.message);
      setEmailError("An unexpected error occurred. Please try again.");
      setAuthing(0);
    }
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
          SIGN IN
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="email"
          placeholder="john_doe@gmail.com"
          fullWidth
          margin="normal"
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="password"
          placeholder="iLoveFood!"
          fullWidth
          margin="normal"
          error={!!passwordError}
          helperText={passwordError}
        />
        <Link
          href="#"
          marginTop={1}
          marginBottom={2}
          style={{ alignSelf: "flex-end", fontSize: "0.875rem" }} // Smaller and aligned to the right
        >
          Forgot password?
        </Link>
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
          LOGIN
        </Button>
      </Box>
    </Box>
  );
};

const Logout = ({ setAuthing }) => {
  return (
    <Box className="logout-box">
      <Button
        variant="contained"
        color="secondary"
        aria-label="Sign Out"
        onClick={() => {
          removeLoginCookie();
          setAuthing(0);
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

const Signin = ({ authing, setAuthing, setUser, setUID }) => {
  return (
    <>
      {authing === 0 ? (
        <Login setAuthing={setAuthing} setUser={setUser} setUID={setUID} />
      ) : (
        <Logout setAuthing={setAuthing} />
      )}
    </>
  );
};

export default Signin;
