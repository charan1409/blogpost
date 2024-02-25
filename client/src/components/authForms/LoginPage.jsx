import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyIcon from "@mui/icons-material/Key";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

import { signIn } from "../../utils/axiosCalls";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChanges = (event) => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(username === "" || password === ""){
      toast.error("Please fill all the fields")
      return
    }
    const user = {
      username: username,
      password: password,
    };
    const res = await signIn(user);
    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      Cookies.set("username", res.data.username);
      navigate("/");
    } else {
      toast(res.data.message)
    }
  };

  return (
    <>
      <ToastContainer />
      <Typography variant="h4" component="h1" align="center">
        Login
      </Typography>
      <TextField
        name="username"
        label="Username"
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
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
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
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Login
      </Button>
      <Typography variant="body1" component="p" sx={{ mt: 2 }}>
        Don't have an account?
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => {
          navigate("/signup");
        }}
      >
        Register
      </Button>
    </>
  );
}

export default LoginPage;
