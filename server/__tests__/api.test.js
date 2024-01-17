const request = require("supertest");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");
const Blog = require("../models/Blog");
const { generateToken } = require("../routes/utils/AuthToken");

describe("POST /login", () => {
  beforeAll(async () => {
    // Connect to the MongoDB Memory Server database
    await mongoose.connect(process.env.MONGO_URI);
  });
  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await User.deleteMany({});
  });
  afterAll(async () => {
    // Close the database connection so that Jest can exit successfully
    await User.deleteMany({});
    await mongoose.connection.close();
  });
  test('should return a token and "You are now logged in!" message on successful login', async () => {
    const testUser = {
      username: "testuser",
      password: await bcrypt.hash("testpassword", 10), // Hash the password for comparison
      email: "testuser@gmail.com",
    };

    // Save the test user to the database
    await User.create(testUser);
    // Make a POST request to the /login endpoint with the test user credentials
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" });

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("message", "You are now logged in!");
  });

  test('should return "User not found" message if the user is not found', async () => {
    // Make a POST request to the /login endpoint with invalid user credentials
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "nonexistentuser", password: "invalidpassword" });

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test('should return "Invalid password" message if the password is incorrect', async () => {
    const testUser = {
      username: "testuser",
      password: await bcrypt.hash("testpassword", 10), // Hash the password for comparison
      email: "testuser@gmail.com",
    };

    // Save the test user to the database
    await User.create(testUser);
    // Make a POST request to the /login endpoint with incorrect password
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "incorrectpassword" });

    // Assertions
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Invalid password");
  });
});

describe("POST /signup", () => {
  beforeAll(async () => {
    // Connect to the MongoDB Memory Server database
    await mongoose.connect(process.env.MONGO_URI);
  });
  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await User.deleteMany({});
  });
  afterAll(async () => {
    // Close the database connection so that Jest can exit successfully
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('should create a new user and return a token and "You are now signed up!" message', async () => {
    const newUser = {
      username: "testuser",
      password: "testpassword",
      email: "testuser@example.com",
    };

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("message", "You are now signed up!");

    // Check if the user is saved in the database
    const savedUser = await User.findOne({ username: "testuser" });
    expect(savedUser).not.toBeNull();
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.email).toBe("testuser@example.com");

    // Check if the password is hashed
    const passwordMatch = await bcrypt.compare(
      "testpassword",
      savedUser.password
    );
    expect(passwordMatch).toBe(true);
  });

  test('should return "Username already exists" if the username is taken', async () => {
    // Create a user with the same username in the database
    const existingUser = {
      username: "existinguser",
      password: "existingpassword",
      email: "existinguser@example.com",
    };
    await User.create(existingUser);

    const duplicateUser = {
      username: "existinguser",
      password: "newpassword",
      email: "newuser@example.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(duplicateUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Username already exists");
  });

  test('should return "Email already exists" if the email is taken', async () => {
    // Create a user with the same email in the database
    const existingUser = {
      username: "existinguser",
      password: "existingpassword",
      email: "existinguser@example.com",
    };
    await User.create(existingUser);

    const duplicateUser = {
      username: "newuser",
      password: "newpassword",
      email: "existinguser@example.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send(duplicateUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Email already exists");
  });
});

describe("GET /profilePicture", () => {
  beforeAll(async () => {
    // Connect to the MongoDB Memory Server database
    await mongoose.connect(process.env.MONGO_URI);
  });
  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await User.deleteMany({});
  });
  afterAll(async () => {
    // Close the database connection so that Jest can exit successfully
    await User.deleteMany({});
    await mongoose.connection.close();
  });
  test("should return the user's profile picture if the user is authenticated", async () => {
    // Create a test user with a profile picture URL
    const testUser = {
      username: "testuser",
      password: "testpassword",
      email: "testuser@example.com",
      profilePicture: "https://example.com/testuser/profile-picture.jpg",
    };
    const savedUser = await User.create(testUser);
    const token = generateToken(savedUser);

    const response = await request(app)
      .get("/auth/profilePicture")
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "image",
      "https://example.com/testuser/profile-picture.jpg"
    );
  });

  test('should return "User not found" if the user is not authenticated', async () => {
    const response = await request(app).get("/auth/profilePicture");

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "No token provided");
  });

  test('should return "User not found" if the authenticated user is not found in the database', async () => {
    // Create a token with a non-existent user ID
    const fakeToken = generateToken({ userId: "nonexistentuserid" });

    const response = await request(app)
      .get("/auth/profilePicture")
      .set("Authorization", `${fakeToken}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});

describe("GET /get-blogs", () => {
  beforeAll(async () => {
    // Connect to a test database or perform any setup needed
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Disconnect from the test database or perform any cleanup
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("should get a list of blogs", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@example.com",
    });
    const savedUser = await User.create(testUser);
    // Create some test blogs in the database
    const testBlogs = [
      {
        title: "Blog 1",
        content: "Lorem ipsum...",
        image: "image1.jpg",
        date: "2022-01-01",
        owner: savedUser._id,
      },
      {
        title: "Blog 2",
        content: "Dolor sit amet...",
        image: "image2.jpg",
        date: "2022-01-02",
        owner: savedUser._id,
      },
    ];

    await Blog.create(testBlogs);

    // Make a GET request to the /get-blogs endpoint
    const response = await request(app).get("/blog/get-blogs");

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});

describe("GET /get-blog/:id", () => {
  beforeAll(async () => {
    // Connect to a test database or perform any setup needed
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Disconnect from the test database or perform any cleanup
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("should get a blog by ID", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@gmail.com",
    });
    const savedUser = await User.create(testUser);
    // Create a test blog in the database
    const testBlog = {
      title: "Blog 1",
      content: "Lorem ipsum...",
      image: "image1.jpg",
      date: "2022-01-01",
      owner: savedUser._id,
    };
    const savedBlog = await Blog.create(testBlog);
    // Log in the test user and get the token
    const token = generateToken(testUser);

    // Make a GET request to the /get-blog/:id endpoint with the test blog ID and authentication token
    const response = await request(app)
      .get(`/blog/get-blog/${savedBlog._id}`)
      .set("Authorization", `${token}`);

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", String(savedBlog._id));
    expect(response.body).toHaveProperty("title", "Blog 1");
    // Add more assertions for other properties
    expect(response.body).toHaveProperty("isLiked", false); // Assuming the user hasn't liked the blog
    expect(response.body).toHaveProperty("isOwner", true); // The test user is the owner
  });
});

describe("POST /create-blog", () => {
  beforeAll(async () => {
    // Connect to a test database or perform any setup needed
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Disconnect from the test database or perform any cleanup
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("should create a new blog", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@gmail.com",
    });
    const savedUser = await User.create(testUser);
    // Log in the test user and get the token
    const token = generateToken(testUser);
    const newBlog = {
      title: "Blog 1",
      content: "Lorem ipsum...",
      image: "image1.jpg",
      date: "2022-01-01",
      owner: savedUser._id,
    };
    const response = await request(app)
      .post("/blog/create-blog")
      .set("Authorization", `${token}`)
      .send(newBlog);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Blog posted successfully");
  });
});

describe("PUT /update-blog/:id", () => {
  beforeAll(async () => {
    // Connect to a test database or perform any setup needed
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Disconnect from the test database or perform any cleanup
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("should update a blog", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@gmail.com",
    });
    const savedUser = await User.create(testUser);
    // Log in the test user and get the token
    const token = generateToken(testUser);
    // Create a test blog in the database
    const testBlog = {
      title: "Blog 1",
      content: "Lorem ipsum...",
      image: "image1.jpg",
      date: "2022-01-01",
      owner: savedUser._id,
    };
    const savedBlog = await Blog.create(testBlog);
    // Update the blog
    const updatedBlog = {
      title: "Updated Blog",
      content: "Updated content",
      image: "updated-image.jpg",
    };
    const response = await request(app)
      .put(`/blog/update-blog/${savedBlog._id}`)
      .set("Authorization", `${token}`)
      .send(updatedBlog);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Blog updated successfully");
  });
});

describe("DELETE /delete-blog/:id", () => {
  beforeAll(async () => {
    // Connect to a test database or perform any setup needed
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Disconnect from the test database or perform any cleanup
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("should delete a blog", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@gamil.com",
    });
    const savedUser = await User.create(testUser);
    // Log in the test user and get the token
    const token = generateToken(testUser);
    // Create a test blog in the database
    const testBlog = {
      title: "Blog 1",
      content: "Lorem ipsum...",
      image: "image1.jpg",
      date: "2022-01-01",
      owner: savedUser._id,
    };
    const savedBlog = await Blog.create(testBlog);
    // Delete the blog
    const response = await request(app)
      .delete(`/blog/delete-blog/${savedBlog._id}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Blog deleted successfully"
    );
  });
});

describe("PUT /like-blog/:id", () => {
  beforeAll(async () => {
    // Connect to a test database or perform any setup needed
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Disconnect from the test database or perform any cleanup
    await Blog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database or perform any setup needed before each test
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  test("should like a blog", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@gmail.com",
    });
    const savedUser = await User.create(testUser);
    // Log in the test user and get the token
    const token = generateToken(testUser);
    // Create a test blog in the database
    const testBlog = {
      title: "Blog 1",
      content: "Lorem ipsum...",
      image: "image1.jpg",
      date: "2022-01-01",
      owner: savedUser._id,
    };
    const savedBlog = await Blog.create(testBlog);
    // Like the blog
    const response = await request(app)
      .put(`/blog/like-blog/${savedBlog._id}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "The blog has been liked");
  });

  test("should unlike a blog", async () => {
    const testUser = await User.create({
      username: "testuser",
      password: "testpassword",
      email: "testuser@gamil.com",
    });
    const savedUser = await User.create(testUser);
    // Log in the test user and get the token
    const token = generateToken(testUser);
    // Create a test blog in the database
    const testBlog = {
      title: "Blog 1",
      content: "Lorem ipsum...",
      image: "image1.jpg",
      date: "2022-01-01",
      owner: savedUser._id,
      likedBy: [savedUser._id],
    };
    const savedBlog = await Blog.create(testBlog);
    // Unlike the blog
    const response = await request(app)
      .put(`/blog/like-blog/${savedBlog._id}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "The blog has been disliked"
    );
  });
});
