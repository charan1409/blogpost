# BLOG POST

The Blog Post Website is a user-friendly platform that empowers individuals to share their thoughts through personalized blog posts. Users can easily sign up, log in, and create engaging content with the flexibility to edit and delete their posts. The platform fosters user interaction by allowing likes on blog posts, creating a sense of community appreciation. With a responsive design for seamless use across devices, coupled with robust security measures like hashed passwords, the website ensures a safe and enjoyable experience.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Run the Project](#run-the-project)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/charan1409/blogpost
   ```
2. Navigate to the project directory and open two terminal for client and server

   ```bash
   cd blogpost
   cd client
   cd server
   ```
3. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root of the project:

   ```env
   PORT=5000
   MONGODB_URI=you-mongodb-link
   SECRET_KEY=your-secret-key
   ```

   Replace `your-database` and `your-secret-key` with your MongoDB database URL and a secret key for JWT authentication.

## Run the Project

1. Start the server:

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:5000` (or the port you specified in the `.env` file).

## Testing

Run the test suite using Jest:

```bash
npm test
```
