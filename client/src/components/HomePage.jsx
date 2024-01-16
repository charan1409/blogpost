import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import BlogCard from "./blogCard.jsx/BlogCard";
import { getBlogs } from "../utils/axiosCalls";

function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getBlogs();
      setBlogs(response.data);
    };
    fetchBlogs();
  }, []);

  return (
    <Box
      sx={{
        margin: "0% 7% 20px 7%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        "@media (max-width: 600px)": {
          margin: "0% ",
          gap: "0px",
        },
      }}
    >
      {blogs.map((blog) => (
        <Box key={blog._id}>
          <BlogCard blog={blog} />
        </Box>
      ))}
    </Box>
  );
}

export default HomePage;
