import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";

function NavigationBar({ user }) {
  const navigate = useNavigate();
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);

  const handleOptionsClick = (event) => {
    setOptionsAnchorEl(event.currentTarget);
  };

  const handleOptionsClose = () => {
    setOptionsAnchorEl(null);
  };

  const handleLogout = () => {
    handleOptionsClose();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 5,
        width: "100%",
        height: "70px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        sm: {
          gap: "0px",
        },
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          textAlign: "left",
          marginLeft: "80px",
          "@media (max-width: 600px)": {
            marginLeft: "20px",
          },
        }}
      >
        <Typography
          sx={{
            width: "fit-content",
            fontSize: "28px",
            fontWeight: "bold",
            cursor: "pointer",
            "@media (max-width: 600px)": {
              fontSize: "24px",
            },
          }}
          onClick={() => navigate("/")}
        >
          Blog Post
        </Typography>
      </Box>
      {user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: "20px",
            marginRight: "120px",
            "@media (max-width: 600px)": {
              marginRight: "20px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "4px",
              border: "2px solid #333",
              padding: "5px 8px",
              borderRadius: "20px",
              cursor: "pointer",
              "@media (max-width: 600px)": {
                border: "none",
                padding: "0",
              },
            }}
            onClick={() => navigate("/create-blog")}
          >
            <AddCircleOutlineSharpIcon
              sx={{
                "@media (max-width: 600px)": {
                  fontSize: "30px",
                },
              }}
            />
            <Typography
              sx={{
                "@media (max-width: 600px)": {
                  display: "none",
                },
              }}
            >
              New Post
            </Typography>
          </Box>
          <Box
            sx={{
              cursor: "pointer",
            }}
            onClick={handleOptionsClick}
          >
            <IconButton>
              <Avatar
                src={user?.image}
                sx={{
                  width: "40px",
                  height: "40px",
                  "@media (max-width: 600px)": {
                    width: "30px",
                    height: "30px",
                  },
                }}
              />
            </IconButton>
          </Box>
          <Menu
            anchorEl={optionsAnchorEl}
            open={Boolean(optionsAnchorEl)}
            onClose={handleOptionsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            disableScrollLock={true}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
}

export default NavigationBar;
