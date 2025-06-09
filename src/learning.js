
// caret(^, ~) : mazor ver: minor ver: patch
// automatically upgraded to mazor vers.x.x/
// so the actual version we are using may be different from what written in package in package.json

// what actual version i am using is defined by package.lock

//app.use("/route", rh1, [rh2, rh3], rh4)

// GET /route => it check all the app.xxx("/matching route") functions 
// GET /route => middleware chain => request handler

// app.use() and app.all() difference => 
// app.use() : Prefix match	: Logging, CORS, Auth middleware	
// app.all() : Exact match : Maintenance page, API version checks


// app.use("/", (req, res)=>{
//   res.send("Namste Node!")
// })
// any thing matches with this "/" then this round handler work
// means "/", "/hello", "/test" all will run that route handler 

// if we put "/" in last of the route then /hello,  /test wil work as we want-> order matters




const express = require('express')

const app = express()

const connectDB = require("./config/database")

// this will work everytime if we remove from comment
// app.use("/user", (req, res)=>{
//   res.send({firstName:"Puneet", lastName:"Vishnoi"});
// })

// this will only handle GET call to /user
app.get("/user", (req, res)=>{
  console.log(req.query)
  res.send({firstName:"Puneet", lastName:"Vishnoi"});
})

app.get("/user/:userId", (req, res)=>{
  console.log(req.params)
  res.send({firstName:"Puneet", lastName:"Vishnoi"});
})

app.post("/user", (req, res)=>{
  console.log("Save Data to the database");
  res.send("Data succesfully saved to the database");
})

// b is optional
app.get(/^\/ab?c$/, (req, res) => {
  res.send("b is optional");
});

// one or more b's
app.get(/^\/ab+c$/, (req, res) => {
  res.send("one or more b's");
});

// anything between b and c
app.get(/^\/ab.*c$/, (req, res) => {
  res.send("wildcard between b and c");
});


// this will match app the HTTP method API calls to /test  
app.use("/test" ,(req, res)=>{
  res.send("Hello from the server");
})

app.use("/multi1", (req, res)=>{
  // res.send("Route Handler 1");
  // keeps on hanging
},
(req, res)=>{
  res.send("Route Handler 2");
},
)

app.use("/multi2", (req, res, next)=>{
  // res.send("Route Handler 1");
  next();
  //if we remove comment from res.send() from router 1 then client get only first response and code through error=> cannot set headers after they are send to client
},
(req, res)=>{
  res.send("Route Handler 2");
},
)

app.use("/multi3", (req, res, next)=>{
  next();
  // code through error=> cannot set headers after they are send to client
  res.send("Route Handler 1");

},
(req, res)=>{
  res.send("Route Handler 2");
},
)

app.use("/multi4", (req, res, next)=>{
  console.log("Route Handler 1");
  next();

},
(req, res, next)=>{
  console.log("Route Handler 2");
  next();
},
(req, res, next)=>{
  console.log("Route Handler 3");
  next();
  // client gets an err => can not find "/multi4" and all the console.log will print
},
)


// handle Auth Middleware for all GET, POST,  ... requests

app.use("/admin", (req, res, next)=>{
  console.log("Admin Auth is getting checked!!", req.headers)
  const token = req.header('Authorization').split(' ')[1];
  const isAdminAuthorized = token === "xyz"

  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  }else{
    next();
  }
});

app.get("/admin/getAllData", (req, res)=>{
  res.send("All Data Sent");
})

app.get("/admin/deleteUser", (res, req)=>{
  res.send("Deleted a user");
})


connectDB()
.then(()=>{
  console.log("Database connection established...")
  //once the db is connected succesfully then connect with server.
  app.listen(3000, ()=>{
    console.log("server is succesfully listening on port 3000...")
  });
})
.catch((err)=>{
  console.log("Database cannot be connected!!")
})


