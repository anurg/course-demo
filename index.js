const express = require("express");
const { userRouter } = require("./routes/user")
const { adminRouter } = require("./routes/admin");
const admin = require("./routes/admin");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('first', { message: null });
});
app.get("/user", function(req,res) {
  if (req.session.user) {
    console.log(req.session.user)
      res.render('user', { user: req.session.user });
    } else {
      res.redirect('/api/v1/user/login');
    }
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin",adminRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
app.listen(port,function() {
  console.log(`Server started on the port ${port}`); 
});
}
main();
