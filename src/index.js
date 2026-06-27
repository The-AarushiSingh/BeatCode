console.log("1");

const express = require("express");
console.log("2");

const app = express();
require("dotenv").config();
console.log("3");

const main = require("./config/db");
console.log("4");

const cookieParser = require("cookie-parser");
console.log("5");

const redisClient = require("./config/redis");
console.log("6");

const problemRouter = require("./routes/prbCreator");
console.log("7");

const authRouter = require("./routes/userAuth");
console.log("8");

app.use(express.json());
app.use(cookieParser());

//*Promise? "I promise your pizza will come."
//*In JavaScript:
//*const result = fetch(...)
//*The data isn't available immediately
//*So JavaScript says:
//*I'll give you a Promise.
//*The actual value will come later. 
/*
Why do we need it?

Imagine MongoDB connection.

mongoose.connect(...)

Connecting to a database takes time:

Internet
↓
Atlas Server
↓
Authentication
↓
Connection

Maybe:

2 seconds

Maybe:

5 seconds

JavaScript doesn't want to freeze for 5 seconds.

So:

mongoose.connect(...)

returns a Promise.

Promise States

A Promise can be in 3 states:

Pending
Pizza being prepared

or

MongoDB connecting...
Fulfilled
Pizza arrived

or

MongoDB connected
Rejected
Pizza shop cancelled order

or

Wrong MongoDB password
What does await do?

Suppose:

await mongoose.connect(...)

Read it like:

Wait here.
Don't move to next line.
Until Promise finishes.

Example:

console.log("A");

await main();

console.log("B");

Output:

A
(wait)
B
Now Promise.all()

Suppose:

main()

takes:

3 seconds

and

redisClient.connect()

takes:

2 seconds

Without Promise.all:

await main();
await redisClient.connect();

Timeline:

3 sec
+
2 sec
=
5 sec

With Promise.all:

await Promise.all([
   main(),
   redisClient.connect()
]);

Timeline:

Mongo starts
Redis starts
together
3 sec

Total:

3 seconds

because we only wait for the slowest one.

What if one fails?

Suppose:

MongoDB connected ✔
Redis failed ❌

Then:

Promise.all(...)

fails.

And execution jumps to:

catch(err)

This is why your code has:

try{
   await Promise.all(...)
}
catch(err){
   console.log(err)
}
The Mental Translation

Whenever you see:

await Promise.all([
   main(),
   redisClient.connect()
]);

Translate it to English:

Start MongoDB connection.
Start Redis connection.

Wait until BOTH are ready.

If either fails,
throw an error.

That's literally all it's doing.

And once this clicks, 90% of async backend code becomes much easier to read.
*/
app.use("/user",authRouter)
app.use("/problem",problemRouter)
const initializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);

    console.log("MongoDB and Redis Connected");

    app.listen(process.env.PORT, () => {
      console.log("Server listening on port " + process.env.PORT);
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



