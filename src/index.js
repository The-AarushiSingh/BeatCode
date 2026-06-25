const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser=require('cookie-parser');
const redisClient=require('./config/redis')

app.use(express.json());
app.use(cookieParser());

const initializeConnection = async () => {
  try {
    await Promise.all([
      main(),
      redisClient.connect()
    ]);

    console.log("MongoDB and Redis Connected");

    app.listen(process.env.PORT, () => {
      console.log(
        "Server listening on port " +
        process.env.PORT
      );
    });

  } catch (err) {
    console.log(err);
  }
};

initializeConnection();

// main()
// .then(async () => {
//   app.listen(process.env.PORT, () => {
//     console.log("Server is listening at PORT " + process.env.PORT);
//   });
// })
// .catch(err=>console.log("An Error has occured"+err))
