const express = require("express")
const app = express()

// panggil router member
const member = require("./routers/member")

app.use("/api/member",member)

app.listen(8000,() => {
    console.log(`Server run on port 8000`);
})