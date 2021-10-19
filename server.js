const express = require("express")
const app = express()

// panggil router member
const member = require("./routers/member")
const users = require("./routers/users")

app.use("/api/member", member)
app.use("/api/users", users)

app.listen(8000,() => {
    console.log(`Server run on port 8000`);
})