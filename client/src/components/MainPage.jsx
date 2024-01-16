import React, { useState, useEffect } from "react";
import AuthPage from "./AuthPage";
import HomePage from "./HomePage";
import NavigationBar from "./NavigationBar";
import BlogPage from "./BlogPage";
import CreateEditBlogPage from "./CreateEditBlogPage";
import { useNavigate } from "react-router-dom";

import { profilePicture } from "../utils/axiosCalls";

import { Box } from "@mui/material";

const MainPage = ({ page }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      profilePicture()
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setUser(null);
      if (page !== "login" && page !== "signup") {
        navigate("/login");
      }
    }
  }, [setUser, navigate, page]);

  const handlePageChange = () => {
    switch (page) {
      case "login":
        return <AuthPage formType="login" />;
      case "signup":
        return <AuthPage formType="signup" />;
      case "home":
        return <HomePage />;
      case "blog":
        return <BlogPage />;
      case "create":
        return <CreateEditBlogPage page={page}/>;
      case "edit":
        return <CreateEditBlogPage page={page}/>;
      default:
        return <AuthPage formType="login" />;
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavigationBar user={user} />
      <Box
        sx={{
          paddingTop: "80px",
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          backgroundColor: "#eee",
        }}
      >
        {handlePageChange()}
      </Box>
    </Box>
  );
};

export default MainPage;
