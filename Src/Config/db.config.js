const mongoose = require("mongoose");

module.exports = mongoose.connect("mongodb://127.0.0.1:27017/Movie-App")

.then(() => {
    console.log("Database Connected Successfully")
}).catch((err) => {
    throw(err)
})
