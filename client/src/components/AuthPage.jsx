import React from "react";
import LoginPage from "./authForms/LoginPage";
import SignupPage from "./authForms/SignupPage";

import { Box } from "@mui/material";

const AuthPage = ({ formType }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 5,
          padding: "20px",
          borderRadius: "10px",
          "@media (max-width: 600px)": {
            width: "80%",
            padding: "10px 5px",
          },
        }}
      >
        {formType === "login" && <LoginPage />}
        {formType === "signup" && <SignupPage />}
      </Box>
    </Box>
  );
};

export default AuthPage;
