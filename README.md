# N-E-P-P-facebookOAuth
Node Express Postgres with local and Facebook OAuth using passport

PREREQUISITES:
1) You should have postgres installed in your system globally
2) You should create a database with a single table named 'users' with fields
id as primary key with bigserial not null, name of varchar(200) not null, email of varchar(200), password of varchar(200) and email as contraint unique
3) You should also install all the packages mention in package.json file under dependencies secrtion by using npm i (package-name) command. After all the packages are installed follow other instructions mentioned below to run the app. 

This demo app is just a small login/registration backend app built in Node-Express using postgreSQL as a database. 
User has 2 ways to login into the dashboard.
1) By using local database (use registeration form for this purpose)
2) By using PassportJs' FacebookOAuth. (Login through facebook)

Ovrall functionality of app:
->User hits localhost:3000 and is redirected to the main (index.js) page.
->Then clicks on Login! button there and is redirected to (login.js) page through hittin the get route for login in (server.js).
->if user is new commer (which he is) then click on the register button and register yourself
->then login through the login page
->if you want to login through facebook then just click sign in from facebook button and you'll be good to go.
->After logging in (with either of the options) you'll be redirected to dahsboard.ejs page with your name displayed and a logout button below.

NOTE: This app will only run after you enter YOUR OWN Facebook clientID and clientSecret key in oAuth.js file. 
You can get these credentials from developers.facebook. There are many tutorials on how to generate one using your own facebook. 

NOTE: in dbConfig.js you have to add your own postgres credentials in order to connect with your local database.

I have not added any front end to this project. Feel free to add frontend if you're interested. Maybe using sny of the latest platforms like Reat or maybe even simple bootstrap. 

NOTE: you can notice there is no functionality of Reset password and Forgot Password. 
If you are interested then feel free to add those to this project. 

I made this because while performing a task I couldn't find any similar project that offered Node Express postgres with Facebook's authentication using passport. 
I know there are plenty with Mongoose and other. Although this is just a small contribution to the developer's community from my side. Hope you like it. Thanks and 
Happy Coding :)