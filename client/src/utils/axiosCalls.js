import axios from "./axiosHelper";

export const signUp = async (user) => {
  try {
    const response = await axios.post("/auth/signup", user);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const signIn = async (user) => {
  try {
    const response = await axios.post("/auth/login", user);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const profilePicture = async () => {
  try {
    const response = await axios.get("/auth/profilePicture");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createBlog = async (blog) => {
  try {
    const response = await axios.post("/blog/create-blog", blog, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getBlogs = async () => {
  try {
    const response = await axios.get("/blog/get-blogs");
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getMyBlogs = async () => {
  try {
    const response = await axios.get("/blog/get-my-blogs");
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getBlog = async (id) => {
  try {
    const response = await axios.get(`/blog/get-blog/${id}`);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const updateBlog = async (id, blog) => {
  try {
    const response = await axios.put(`/blog/update-blog/${id}`, blog, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`/blog/delete-blog/${id}`);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const likeBlog = async (id) => {
  try {
    const response = await axios.put(`/blog/like-blog/${id}`);
    return response;
  } catch (err) {
    console.log(err);
  }
};
