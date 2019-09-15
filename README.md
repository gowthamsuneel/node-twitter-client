# node-twitter-client
Access twitter api's using nodejs

**Prerequisites**
****
- Install Nodejs(v10.0) and Mongodb(3.7)
- Clone this repository
- Go to node-twitter-client folder
- npm i
- Create a twitter app - https://developer.twitter.com/en/apps (If you don not have twitter developer account, create a new)
- Update .env file with twitter app specifications
- npm start

**Description**
****
This is proof of concept to access twitter api is from client libraries like NodeJS

**Services**
****
- GET - http://localhost:4000/auth/login
- GET  - http://localhost:4000/twitter/tweets
- GET - http://localhost:4000/twitter/links
- POST - http://localhost:4000/twitter/filter -> {location : 'Hyderabad'}
- View Tweets - http://localhost:4000/index.html

