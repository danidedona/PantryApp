import React, { useState } from "react";
import Home from "./home";
import Signin from "./signin";
import AccountCreation from "./account-creation";
import { Container, Box } from "@mui/material";

/**
 * This component controls the authentication of the webapp
 * 0 = logged out
 * 1 = signed in
 * 2 = creating new account
 * @returns Correct screen based on login status
 *
 */
export default function Authentication() {
  const [authing, setAuthing] = useState(0);
  const [user, setUser] = useState(null);
  const [UID, setUID] = useState("");

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center">
        {authing === 0 && (
          <Signin
            authing={authing}
            setAuthing={setAuthing}
            setUser={setUser}
            setUID={setUID}
          />
        )}
        {authing === 1 && <Home user={user} setAuthing={setAuthing} />}
        {authing === 2 && <AccountCreation setAuthing={setAuthing} UID={UID} />}
      </Box>
    </Container>
  );
}
