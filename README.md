# Kean ACM Backend

This is the backend API for the **Kean University Association for Computing Machinery (ACM)** website. It handles authentication, event management, member profiles, and administrative functions.

## 🚀 Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & Cookies
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer (SMTP)

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for image uploads

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173  # URL of your frontend application

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=your_name
```

## 📦 Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Karangarha/Kean_ACM_Backend.git
    cd Kean_ACM_Backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Server

### Development Mode

Runs the server with `nodemon` for auto-reloading:

```bash
npm run dev
```

### Production Mode

Runs the server using standard Node:

```bash
npm start
```

The server will start on `http://localhost:5000` (or your defined `PORT`).

## 📡 API Endpoints

### Authentication (`/api/auth`)

- `POST /login` - Login user
- `GET /logout` - Logout user
- `GET /me` - Get current user info (Protected)
- `PUT /setup-password` - Set password for new account
- `POST /forgotpassword` - Request password reset
- `PUT /resetpassword/:resettoken` - Reset password

### Events (`/api/events`)

- `GET /` - Get all events
- `POST /` - Create event (Admin only)
- `PUT /:id` - Update event (Admin only)
- `DELETE /:id` - Delete event (Admin only)

### User Invites (`/api/invites`)

- `GET /` - List all invites (Admin only)
- `POST /` - Create new invite (Admin only)
- `DELETE /:id` - Cancel invite (Admin only)

### Profiles (`/api/profiles`)

- `GET /:id` - Get specific member profile
- `PUT /:id` - Update profile

### Uploads (`/api/upload`)

- `POST /` - Upload an image to Cloudinary

## 📁 Project Structure

- `src/config` - Database connection
- `src/controllers` - Request logic
- `src/middleware` - Auth and error handling
- `src/models` - Mongoose schemas
- `src/routes` - API route definitions
- `src/utils` - Helpers (Email, etc.)

## 🔒 Security Features

- **Helmet**: Sets secure HTTP headers.
- **Rate Limiting**: Prevents abuse by limiting repeated requests.
- **CORS**: Configured to allow requests from the frontend.
- **HttpOnly Cookies**: Securely stores JWT tokens.
