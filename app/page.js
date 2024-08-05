"use client";

import Authentication from "./Components/authentication";
import { Box } from "@mui/material";

/**
 * This is the highest level component!
 */
function App() {
  return (
    <Box
      className="App"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
    >
      <Authentication />
    </Box>
  );
}

export default App;
