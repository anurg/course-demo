const express = require("express");
const { userRouter } = require("./routes/user")
const { adminRouter } = require("./routes/admin");
const admin = require("./routes/admin");
const app = express();
const port = 3000;
app.use(express.json());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin",adminRouter);



app.listen(port,function() {
  console.log(`Server started on the port ${port}`); 
})