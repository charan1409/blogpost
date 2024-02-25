import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Avatar } from "@mui/material";
import BlogCard from "./blogCard/BlogCard";

import { getMyBlogs } from "../utils/axiosCalls";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getMyBlogs();
      setBlogs(response.data);
    };
    fetchBlogs();
  }, []);
  return (
    <Box
      sx={{
        margin: "0% 7% 20px 7%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        "@media (max-width: 600px)": {
          margin: "0% ",
          gap: "0px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          "@media (max-width: 600px)": {
            gap: "10px",
          },
        }}
      >
        <Typography variant="h3" sx={{ mt: 3, mb: 3 }}>
          Profile
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Avatar
              alt="John Doe"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5">Name: John Doe</Typography>
          </Box>
          <Box>
            <Typography variant="h2">Blogs</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        {blogs.map((blog) => (
          <Box key={blog._id}>
            <BlogCard blog={blog} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProfilePage;
