const express = require("express");
const app = express();
require("./Src/Config/db.config");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const UserRouter = require("./Src/Routes/UserRouter");
app.use("/",UserRouter);

const MovieRouter = require("./Src/Routes/MoviesRouter");
app.use("/",MovieRouter);

app.listen(PORT,() => {
    console.log(`Server running port not ${PORT}`)
});

