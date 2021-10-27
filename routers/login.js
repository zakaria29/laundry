const { response } = require("express")
const express = require ("express")
const md5 = require('md5')
const app = express()
app.use(express.json())

const models = require('./../models')
const user = models.users;

app.post('/login',(request,response)=>{
    let newLogin = {
        username : request.body.username,
        password : md5(request.body.password),
    }
    let dataUser = user.findOne({
        where : newLogin
    });

    if(dataUser){
        let token = md5(newLogin)
        response.send({token})
    } else {
        response.send('Username atau password salah')
    }
})
 module.exports = app