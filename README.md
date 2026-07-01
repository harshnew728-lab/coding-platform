# Coding Platform Backend

A backend application for an online coding platform inspired by LeetCode. It provides REST APIs for user authentication,coding problem management, code execution, and solution submission. The platform integrates with the Judge0 API to compile and execute user code against test cases.

---

# Features

## User Authentication

* User Registration
* User Login
* JWT-based Authentication
* Password hashing using bcrypt
* Protected routes using authentication middleware

---

## Role-Based Access

The application supports two different roles:

### Admin

Admins can:

* Create coding problems
* Update existing problems
* Delete problems
* Manage problem data

### User

Users can:

* View coding problems
* Execute code
* Submit solutions
* View solved problems
* View previous submissions

Separate authentication and authorization middleware are used to verify JWT tokens and restrict access based on user roles.

---

# Coding Problem Management

Admin APIs provide complete CRUD functionality for coding problems.

Each problem stores information such as:

* Title
* Description
* Difficulty
* Topics
* Constraints
* Examples
* Starter Code
* Hidden Test Cases
* Visible Test Cases

Available APIs include:

* Create Problem
* Update Problem
* Delete Problem
* Get Problem By ID
* Get All Problems

---

# Code Execution

The platform integrates with the Judge0 API for online code execution.

Users can:

* Select programming language
* Write source code
* Provide custom input
* Execute code
* View program output
* View compilation errors
* View runtime errors

Execution is handled through Judge0 without storing execution results as submissions.

---

# Solution Submission

When a user submits a solution:

1. The backend retrieves the hidden test cases of the selected problem.
2. Multiple Judge0 submissions are created using batch submission.
3. Judge0 executes the code against every hidden test case.
4. The backend collects all execution results.
5. Outputs are compared with the expected outputs.
6. The final verdict is generated.
7. Submission details are stored in MongoDB.
8. If all test cases pass, the problem is added to the user's solved problems.

Possible submission results include:

* Accepted
* Wrong Answer
* Compilation Error
* Runtime Error
* Time Limit Exceeded (if returned by Judge0)

---

# Judge0 Integration

Judge0 is used for both:

* Code Execution
* Code Submission

For code execution:

* Executes code against user-provided custom input.
* Returns program output immediately.

For code submission:

* Uses Judge0 Batch Submission API.
* Runs code against all hidden test cases.
* Collects results for every test case.
* Determines the final verdict.

---

# User Progress

The backend maintains user progress by storing:

* Solved problems
* Submission history
* Submission status
* Programming language used
* Submitted source code

Users can retrieve:

* Previously solved problems
* Previous submissions

---

# Security

The backend includes:

* JWT Authentication
* Password hashing with bcrypt
* User Authentication Middleware
* Admin Authorization Middleware
* Environment variable configuration
* Protected API routes

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Judge0 API
* REST APIs

---

# Project Structure

```
src
│
├── config
├── controllers
├── middleware
├── models
├── routes
├── utils
└── index.js
```

---

# Main API Modules

## Authentication

* Register User
* Login User

---

## Problems

* Create Problem
* Update Problem
* Delete Problem
* Get All Problems
* Get Problem By ID

---

## Code Execution

* Execute Code

---

## Submission

* Submit Solution
* Get User Submissions

---

## User

* Get Solved Problems

---

# Installation

Clone the repository

```
git clone <repository-url>
```

Install dependencies

```
npm install
```

Create a `.env` file

```
PORT=
MONGODB_URI=
JWT_SECRET=
JUDGE0_API_URL=
JUDGE0_API_KEY=
```

Run the server

```
npm start
```

---

# Future Improvements

* Frontend application
* Online contests
* Leaderboard
* Discussion section
* Code editor improvements
* Docker support
* Unit and Integration Testing

---

# Learning Outcomes

This project helped me gain practical experience with:

* Building REST APIs using Express.js
* Authentication and Authorization using JWT
* Middleware-based request handling
* MongoDB database design using Mongoose
* Third-party API integration (Judge0)
* Batch code execution and evaluation
* Role-based access control
* Backend project organization using the MVC architecture
