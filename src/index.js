const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser=require('cookie-parser');

app.use(express());
app.use(cookieParser());

main()
.then(async () => {
  app.listen(process.env.PORT, () => {
    console.log("Server is listening at PORT " + process.env.PORT);
  });
})
.catch(err=>console.log("An Error has occured"+err))
