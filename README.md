# Video Platform Project - Amalitech Project

## Project Overview

Paul Leonard, a video creator, required a bespoke video hosting platform tailored to his branding needs. This platform allows users to sign up, log in, navigate video pages, and share video links, while administrator can upload videos with titles and descriptions. The project has been developed using Node.js for the backend and Firebase for video storage and react for frontend.

## Table of Contents

- Project Overview
- Features
- Technologies Used
- Installation
- API Endpoints
- ER Diagram

# Features

## User Features

     * Sign up and log in with email and password.
     * Account verification via email.
     * Password recovery feature.
     * Navigate through video pages.
     * Share links to videos.

## Admin Features

     * Upload videos with title and description.

## Video Page Features

     * Display a single video.
     * Navigation controls (next and previous buttons).
     * Business logo at the top.
     * Share button for sharing video links.

## Technologies Used

     *  Frontend: React.js
     *  Backend: Node.js, Express.js
     *  Database: MongoDB
     *  Storage: Firebase
     * Authentication: JSON Web Tokens (JWT)
     *  Styling: normal CSS

## Installation

     * Prerequisites
     *  Node.js (>=14.x)
     *  npm (>=6.x)
     *  MongoDB
     * Firebase account

# API Endpoints

## User Authentication

- POST /api/signup - Register a new user.
- POST /api/users/login - Log in a user.
- GET /api/verify-email/:token - Verify a user account.
- POST /api/reset-password-request - Request to change password.
- POST /api/users/reset-password - Reset user password.

## Video Management

     * POST /api/videos/upload - Upload a new video - only admin.
     * GET /api/videos/listVideos - Get all videos.
     * GET /api/videos/stream/:id - Get all videos.

# ER-DIAGRAM

entity User {

- ## user_id : INT
  email : VARCHAR
  password : VARCHAR
  is_verified : BOOLEAN
  reset_token : VARCHAR
  }

entity Video {

- ## video_id : INT
  title : VARCHAR
  description : TEXT
  url : VARCHAR
  upload_date : DATETIME
  }

entity Admin {

- ## admin_id : INT
  user_id : INT
  }

User ||--o{ Admin : "is"
User ||--o{ Video : "uploads"
