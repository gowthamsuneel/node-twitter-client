# node-twitter-client
Access twitter api's using nodejs
**Prerequisites**
****
- Install Nodejs(v10.0) and Mongodb(3.7)
- Clone this repository
- Go to node-twitter-client folder
- npm i
- Create a twitter app - https://developer.twitter.com/en/apps (If you don not have twitter account, create a new)
- Update .env file with twitter app specifications
- npm start

**Description**
****
This is proof of concept to access twitter api is from client libraries like NodeJS

**Services**
****
 - This login api is redirecting to twitter login page once user is validated it is redirects to http://localhost:4000/auth/ url which contains logged in user data.
		http://localhost:4000/auth/login

- This will fetch the data from mongodb which is inserted once user logged in success.
		http://localhost:4000/twitter/data
- This will give total count of url's which is shared by users.
 		http://localhost:4000/twitter/links
- Filter API
		http://localhost:4000/twitter/filter

 
