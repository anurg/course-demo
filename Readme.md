Steps for creating Project (Recalling each step)
1. create a project folder (course-demo)

2. Initialize project as node project (npm init -y)
	- it will create package.json file. when you install packages, entry is create in package.json
(Package.json has sections like scripts (script to manage project), dependencies(Installed packages), Dev Dependencies (Package needed in development environment, installed with npm i pkg_name --dev)
Another file gets created which is package.json.lck which locks the package version installed.
while installing the package, we can fix the version or major release version. ^ is used for that-- forgot details.

3. Install packages for node project (npm i pkg_name)
	- express - as http server
	- mongoose - as mongo DB handling
	- jsonwebtoken - for sessions
	- dotenv - for environment variables
	- bcrypt - for hashing the password.
4. Create the Index.js file (touch index.js)
5. Think of routes which will be required for your application
	1. User Routes
		- user login 
		- user signup
		- user purchased courses
		- list all courses (This should work without login and rest of the routes should work only when user is authenticated and logged in)
	2. Admin Routes
		- admin login
		- admin signup
		- add courses
		- edit courses
- Initially all routes will be in same file, but we will refactor the code to introduce the routes folder and keep all routes files (user, admin) there. The functions will be exported and imported in index.js to be used there.
- Middleware for authentication to be used for authenticated routes.
6. index.js file processing
	- import express (const express = require("express")
	- create app instance ( const app = express() )
	- create get or post route ( app.get("/login" , function(req,res) { })
	- Arguments passed through get request is available in req object. (req.name)
	- add body parsing middleware for handling post data passed through body. ( app.use(express.json()) )
	- create server to listen on port 3000 (app.listen(port,function() { ` Server started on the ${port}` })

7. Create a db.js for handling mongoose schema
	- import mongoose
	- get the mongoose connection string and store in .env file parameter (MONGO_DB_URL)
	- install dotenv package. The parameter will be available in process.env.MONGO_DB_URL variable.
	- create Mongoose Schema Structure
	- create mongoose model and map it to Mongo DB Collection. (Mongo DB Collection are like tables in SQL DB and documents are like records. )
	- Export the Models (userModel, adminModel, coursemodel, purchaseModel) and import in index.js
8.  Routes - Routes can be defined in the index folder or in a separate folder routes. 
	- create a folder routes
	- define userRouter, adminRouter files 
	- Do the processing required for the routes and export the routes.
	- import routes in index.js
	- Use express router in index.js (const router = express.Router() )
	- Divert all user requests to userRouter and admin requests to adminRouter. ( router.get("/api/v1/user/",userRouter)
	- in this case, we would need mongoose in userrouter, adminRouter files.
	- userModel.findOne, find, update, create, findById, delete
9. Password Hashing - using the package bcrypt
	1. Creating the Hash 
		- Install bcrypt
		- hash the user password (const hashedPassword = bcrypt.hash(password,5) ) Where 5 is the hashing round.
		- Store in the DB, hashedPassword
	2. Matching the Hash in next login
		- get the users hashedPassword stored in DB
		- get the password in the request body
		- Match them using bcrypt package ( const result = bcrypt.compare(password,hashedPassword) ) returns true or false
10. Session Management - jwt is used to manage the authentication and authorization 
	1. Token generation for first Time, with some expiry time
		- install the jsonwebtoken package
		- when user password is matched using bcrypt, a token is generated using the JWT_SECRET (separate for users and admins).
		- Usually unique field is made a token like emailId or mongoDB ObjectId.
		- jwt.sign({emailId : emailId},JWT_SECRET)
		- return token to user
	2. Token Authentication in second request
		- In the frontend code, store the token in cookie or local stotage
		- Send the token in Headers in next request
		- Verify the token (jwt.verify(req.Headers.token,JWT_SERCRET)
		- if decoded successfully then assume that the User is authenticated and set the emailId as decoded emailId.	
11. Building the front-end (Plain HTML, CSS, JS) - Login Page
	- Install ejs, axios
	- Call API using axios, get the json data or post
	- create a folder views
	- Add user.ejs in that folder
	- app.set('view engine', 'ejs');  // Set EJS as the view engine
	- res.render('profile', { user }); // Render the EJS template with user data
	- use the code in ejs template.    <p><strong>ID:</strong> <%= user.id %></p> 
	

EJS Tutorial
Here are the main EJS commands:

<% %>: Scriptlet tag
For control flow without output

<%= %>: Output tag (escaped)
Outputs the value into the template (HTML escaped)

<%- %>: Output tag (unescaped)
Outputs the unescaped value into the template

<%# %>: Comment tag
For comments that don't output to the rendered page

<%- include('file') %>: Include tag
Includes another EJS file

Here's a breakdown of these commands:

<% %>: Used for JavaScript logic that doesn't produce any output, like loops or conditionals.
<%= %>: Outputs the value of a JavaScript expression, escaping any HTML in the result. This is safer for user-generated content.
<%- %>: Outputs the unescaped value of a JavaScript expression. Use this when you want to include HTML.
<%# %>: For comments in your EJS that won't appear in the final HTML output.
<%- include('file') %>: Includes another EJS file. Useful for partials like headers and footers.


<!-- 1. Scriptlet tag <% %> -->
<% if (user) { %>
  <h2>Welcome, <%= user.name %></h2>
<% } %>

<!-- 2. Output tag (escaped) <%= %> -->
<p>Email: <%= user.email %></p>

<!-- 3. Output tag (unescaped) <%- %> -->
<p>Bio: <%- user.htmlBio %></p>

<!-- 4. Comment tag <%# %> -->
<%# This comment will not appear in the output %>

<!-- 5. Include tag <%- include('file') %> -->
<%- include('header') %>
<h1>Main Content</h1>
<%- include('footer') %>

<!-- Looping example -->
<ul>
<% for(let i=0; i<items.length; i++) { %>
  <li><%= items[i] %></li>
<% } %>
</ul>

<!-- Conditional rendering -->
<% if (showButton) { %>
  <button>Click me</button>
<% } else { %>
  <p>Button is hidden</p>
<% } %>


	
If you want to pass data to all your views without specifying it in each res.render() call, you can use middleware:
javascriptCopyapp.use((req, res, next) => {
  res.locals.globalVar = 'This is available in all views';
  next();
});
This makes globalVar available in all your EJS templates without needing to pass it explicitly each time.

Like we set the userId or emailId after token verification in request object (req.emailId = emailId) so trip to DB is saved and user is assumed to be authenticated.
	
------------------------------------------------------------------------------------------
Client side code for setting the JWT Token in the local Storage

// Storing the token
function storeToken(token) {
  localStorage.setItem('jwtToken', token);
}

// Retrieving the token
function getToken() {
  return localStorage.getItem('jwtToken');
}

// Removing the token (for logout)
function removeToken() {
  localStorage.removeItem('jwtToken');
}

// Example usage
fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ username, password }),
  headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(data => {
  if (data.token) {
    storeToken(data.token);
  }
});

// Using the token in a request
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
})
.then(response => response.json())
.then(data => console.log(data));


------------------------------------------------------------------------------------------
Server side code for setting token inside the cookie

// Server-side (Node.js with Express)
const express = require('express');
const app = express();

app.post('/api/login', (req, res) => {
  // Authenticate user and generate token
  const token = generateToken(user);
  
  // Set cookie
  res.cookie('jwtToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    maxAge: 3600000 // 1 hour
  });
  
  res.json({ message: 'Logged in successfully' });
});

// Client-side
// The cookie will be automatically sent with every request to the same domain

// Example of a fetch request (no need to manually include the token)
fetch('/api/protected')
  .then(response => response.json())
  .then(data => console.log(data));

// To log out, you'd clear the cookie on the server
app.post('/api/logout', (req, res) => {
  res.clearCookie('jwtToken');
  res.json({ message: 'Logged out successfully' });
});
------------------------------------------------------------------------------------------





MONGO_DB_URL="mongodb+srv://nkbblocks:nkbblocks@cluster0.au80q.mongodb.net/course-demo"
USER_JWT_SECRET="asbghdgjkhkj78787090"