<h1 align="center">CMS</h1>

###

<h2 align="left"></h2>

###

<h3 align="left">Description</h3>

###

<p align="left">A simple administrator tool for fetching the data from link and mapping it in local database . It provides searching,filtering, populating the database by link and JsonWebToken authentication.</p>

###

<h2 align="left"></h2>

###

<br clear="both">

<h2 align="center">How to Setup</h2>

###

<h3 align="center">Please make sure that the link for populating the dataase doesn't have any break line in the middle.</h3>

###

<h2 align="left">steps:</h2>

###

<h4 align="left">Step:1</h4>

###

<p align="left">"git clone https://github.com/aimal1amiri/CMS.git" <br>first create one folder, then right click , after that open the terminal or CMD (window) and run the above command.</p>

###

<br clear="both">

<h4 align="left">Step:2</h4>

###

<p align="left">you will see a file is downloaded it into you folder. In terminal or CMD run the below two comands :<br>"cd CMS"<br>"npm run build"</p>

###

<h4 align="left">Step:3</h4>

###

<p align="left">Make sure that you are in the main directory. Then run the following command: <br>"echo -e "NODE_ENV=development\nJWT_SECRET=yourkey" > .env"<br>( you can change the -JWT_SECRET- value if you want )</p>

###

<h4 align="left">Step:4</h4>

###

<p align="left">So now it is the time to run the applicaiton : run the following command,<br>"npm run backend"</p>

###

<h4 align="left">Step:5</h4>

###

<p align="left">Open another terminal or CMD in the same directory ( ex: ...>CMS ) <br>then run these Last two commands:<br>first:  "cd Front-end"<br>second: "npm run dev"</p>

###

<h4 align="left">Step:6</h4>

###

<p align="left">Open your web browser and type the following line:<br>"localhost:5173/"</p>

###