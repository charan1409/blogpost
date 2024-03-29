import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

import { getBlog, likeBlog, deleteBlog } from "../utils/axiosCalls";

const BlogPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await getBlog(id);
      setBlog(response.data);
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (blog?.isLiked === undefined) {
      setBlog({ ...blog, isLiked: false });
    }
  }, [blog]);

  useEffect(() => {
    const loginCheck = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLogged(false);
      } else {
        setIsLogged(true);
      }
    };
    loginCheck();
  }, [navigate]);

  const handleLike = async (liked) => {
    if (isLogged) {
      if (liked) {
        setBlog({ ...blog, isLiked: true, likes: blog.likes + 1 });
      } else {
        setBlog({ ...blog, isLiked: false, likes: blog.likes - 1 });
      }
      await likeBlog(id, liked);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "0% 7% 20px 7%",
        "@media (max-width: 600px)": {
          margin: "0% ",
        },
      }}
    >
      <Card sx={{ mt: 3, width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{ mr: 2, color: "#333", fontSize: "24px" }}
              onClick={() => {
                navigate("/");
              }}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
            {blog?.isOwner && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{ color: "#333", fontSize: "24px" }}
                  title="Edit blog?"
                  onClick={() => {
                    navigate(`/edit-blog/${blog._id}`);
                  }}
                >
                  <BorderColorOutlinedIcon />
                </IconButton>
                {/* <IconButton
                  sx={{ color: "#333", fontSize: "24px" }}
                  title="Disable Blog?"
                >
                  <RemoveCircleOutlineOutlinedIcon />
                </IconButton> */}
                <IconButton
                  sx={{ color: "#f34f34", fontSize: "24px" }}
                  title="Delete blog?"
                  onClick={async () => {
                    await deleteBlog(blog._id);
                    navigate("/");
                  }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              mt: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "bold",
                ml: 3,
              }}
            >
              {blog?.title}
            </Typography>
            {blog?.isLiked ? (
              <IconButton
                sx={{ color: "#f34f34", fontSize: "24px", ml: 2 }}
                title="Unlike blog?"
                onClick={() => {
                  handleLike(false);
                }}
              >
                <FavoriteIcon />
              </IconButton>
            ) : (
              <IconButton
                sx={{ color: "#333", fontSize: "24px", ml: 2 }}
                title="Like blog?"
                onClick={() => {
                  handleLike(true);
                }}
              >
                <FavoriteBorderIcon />
              </IconButton>
            )}
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {blog?.likes}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, ml: 3 }}>
            <Typography variant="body2">
              Posted by{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {blog?.owner?.username}
              </span>{" "}
              on {blog?.date}
            </Typography>
          </Box>
          <CardMedia
            component="img"
            height="400"
            image={blog?.image}
            alt={blog?.title}
          />
          <Typography variant="body1" sx={{ mt: 3, ml: 3 }}>
            <p dangerouslySetInnerHTML={{ __html: blog?.content }} />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogPage;
