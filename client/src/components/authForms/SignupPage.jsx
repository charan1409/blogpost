import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { signUp } from "../../utils/axiosCalls";

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChanges = (event) => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "Email") {
      setEmail(event.target.value);
    } else if (event.target.name === "Password") {
      setPassword(event.target.value);
    } else if (event.target.name === "Confirm Password") {
      setConfirmPassword(event.target.value);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === "" || email === "" || password === "") {
      toast.error("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const user = {
      username: username,
      email: email,
      password: password,
    };
    const res = await signUp(user);
    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } else {
      alert(res.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <Typography variant="h4" component="h1" align="center">
        Sign Up
      </Typography>
      <TextField
        name="username"
        label="Username"
        value={username}
        variant="outlined"
        margin="normal"
        fullWidth
        onChange={(event) => {
          handleChanges(event);
        }}
        InputProps={{
          startAdornment: (
            <IconButton edge="start">
              <PersonSharpIcon />
            </IconButton>
          ),
        }}
      />
      <TextField
        name="Email"
        label="Email"
        type="email"
        value={email}
        variant="outlined"
        margin="normal"
        fullWidth
        onChange={(event) => {
          handleChanges(event);
        }}
        InputProps={{
          startAdornment: (
            <IconButton edge="start">
              <EmailIcon />
            </IconButton>
          ),
        }}
      />
      <TextField
        name="Password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        variant="outlined"
        margin="normal"
        fullWidth
        onChange={(event) => {
          handleChanges(event);
        }}
        InputProps={{
          startAdornment: (
            <IconButton edge="start">
              <KeyIcon />
            </IconButton>
          ),
          endAdornment: (
            <IconButton onClick={handleShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <TextField
        name="Confirm Password"
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        variant="outlined"
        margin="normal"
        fullWidth
        onChange={(event) => {
          handleChanges(event);
        }}
        value={confirmPassword}
        InputProps={{
          startAdornment: (
            <IconButton edge="start">
              <KeyIcon />
            </IconButton>
          ),
          endAdornment: (
            <IconButton onClick={handleShowConfirmPassword} edge="end">
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
      <Typography variant="body1" component="p" sx={{ mt: 2 }}>
        Already have an account?
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    </>
  );
}

export default SignupPage;
