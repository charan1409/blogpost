import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Avatar,
  Box,
} from "@mui/material";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 400,
        "@media (max-width: 600px)": {
          width: "100%",
          padding: "10px 5px",
        },
      }}
    >
      <CardHeader
        avatar={<Avatar alt={blog.owner.username} />}
        sx={{
          "@media (max-width: 600px)": {
            padding: "0px 10px",
          },
          borderBottom: "1px solid #e0e0e0",
        }}
        title={blog.owner.username}
        subheader={blog.date}
      />
      <Box
        onClick={() => navigate(`/blog/${blog._id}`)}
        sx={{
          cursor: "pointer",
        }}
      >
        <CardContent>
          <Typography variant="h5" color="text.primary">
            {blog.title}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="200"
          image={blog.image}
          alt="Paella dish"
        />
      </Box>
      <CardActions disableSpacing>
        <Typography variant="body2" color="text.secondary">
          {blog.likes} likes
        </Typography>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
