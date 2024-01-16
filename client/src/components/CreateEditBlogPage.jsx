import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

import { createBlog, updateBlog, getBlog } from "../utils/axiosCalls";

function CreateEditBlogPage({ page }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [content, setContent] = useState("");
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await getBlog(id);
      if (response.status === 200) {
        setTitle(response.data.title);
        setUploadedImage(response.data.image);
        setContent(response.data.content);
      } else {
        alert(response.message);
      }
    };
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fileInputRef = useRef(null);

  const dropZoneRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedImage(file);
      setUploaded(true);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    fileInputRef.current.value = "";
    setUploadedImage(null);
    setUploaded(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
    setUploaded(true);
  };

  const handleReset = () => {
    if(page === "edit") {
      navigate(`/blog/${id}`);
    } else {
      setTitle("");
      setUploadedImage(null);
      setContent("");
      setUploaded(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (uploadedImage) {
      formData.append("image", uploadedImage);
    }
    if (page === "create") {
      const response = await createBlog(formData);
      if (response.status === 200) {
        alert("Blog created successfully!");
        handleReset();
      }
    } else {
      const response = await updateBlog(id, formData);
      if (response.status === 200) {
        handleReset();
        alert("Blog updated successfully!");
        navigate(`/blog/${id}`);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: 3,
          width: "600px",
          "@media (max-width: 600px)": { width: "330px" },
        }}
      >
        <Typography variant="h5" component="h2">
          {page === "create" ? "Create New Blog Post" : "Edit Blog Post"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              required
            />
            <Box
              ref={dropZoneRef}
              style={{
                border: "2px dashed #aaa",
                width: "100%",
                height: "300px",
                position: "relative",
              }}
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {uploadedImage ? (
                <div>
                  <img
                    src={uploaded ? URL.createObjectURL(uploadedImage) : uploadedImage}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <IconButton
                    onClick={handleDelete}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      color: "#fff",
                      backgroundColor: "#000",
                      fontSize: "1.5rem",
                    }}
                  >
                    <CloseSharpIcon />
                  </IconButton>
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    margin: "50px 0",
                    color: "#888",
                  }}
                >
                  Click or Drag & Drop Image Here
                </p>
              )}
            </Box>
            <Box sx={{ mt: 2}}>
              <label htmlFor="content">Content:</label>
              <ReactQuill
                id="content"
                value={content}
                onChange={(value) => setContent(value)}
              />
            </Box>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                width: "100%",
              }}
            >
              <Button
                type="reset"
                variant="outlined"
                onClick={() => handleReset()}
              >
                {page === "create" ? "Reset" : "Cancel"}
              </Button>
              <Button type="submit" variant="contained">
                {page === "create" ? "Create" : "Update"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default CreateEditBlogPage;
