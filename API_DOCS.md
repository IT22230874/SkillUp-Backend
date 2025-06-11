📘 API Documentation
This document provides an overview of all available API endpoints in the Online Learning Platform backend.

🌐 Base URL
bash
Copy
Edit
http://localhost:5000/api
🔐 Auth Routes
POST /auth/register
Register a new user.

Request Body:

json
Copy
Edit
{
"username": "nick",
"email": "nick@example.com",
"password": "123456"
}
Response:

json
Copy
Edit
{ "message": "User registered successfully" }
POST /auth/login
Login a user.

Request Body:

json
Copy
Edit
{
"email": "nick@example.com",
"password": "123456"
}
Response:

json
Copy
Edit
{ "token": "JWT_TOKEN" }
GET /auth/me
Get authenticated user's info.

Headers:

makefile
Copy
Edit
Authorization: Bearer <token>
Response:

json
Copy
Edit
{
"username": "nick",
"role": "student"
}
POST /auth/set-role
Set user role (student or instructor).

Headers:

makefile
Copy
Edit
Authorization: Bearer <token>
Body:

json
Copy
Edit
{ "role": "instructor" }
Response:

json
Copy
Edit
{ "message": "Role updated", "role": "instructor" }
GET /auth/google
Initiates Google OAuth2 authentication.

GET /auth/google/callback
Handles OAuth2 callback and redirects with JWT.

Redirect URL:

bash
Copy
Edit
/oauth-success?token=<JWT>
POST /auth/upload-image
Upload a profile image.

Headers:

makefile
Copy
Edit
Authorization: Bearer <token>
Form Data:

image: file

folder (optional): target folder in Cloudinary

Response:

json
Copy
Edit
{ "url": "https://cloudinary.com/path/to/image.jpg" }
🤖 Chat Routes
POST /chat
Ask a question to ChatGPT.

Request Body:

json
Copy
Edit
{ "message": "What should I learn for full-stack development?" }
Response:

json
Copy
Edit
{ "response": "You should start with HTML, CSS, and JavaScript..." }
📚 Instructor Routes (Protected)
All require Authorization: Bearer <token> and instructor role.

POST /instructor
Create a new course.

GET /instructor
List instructor's courses.

GET /instructor/:id
Get course details.

PUT /instructor/:id
Edit a course.

DELETE /instructor/:id
Delete a course.

GET /instructor/:id/students
List students enrolled in a course.

POST /instructor/:id/sections
Add a section to a course.

DELETE /instructor/:courseId/sections/:sectionId
Delete a section.

PUT /instructor/:courseId/sections/:sectionId
Update a section.

POST /instructor/:courseId/sections/:sectionId/topics
Add a topic to a section.

DELETE /instructor/:courseId/sections/:sectionId/topics/:topicId
Delete a topic.

PUT /instructor/:courseId/sections/:sectionId/topics/:topicId
Update a topic.
