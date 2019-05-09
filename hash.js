const {SHA512} = require('crypto-js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

 const secret = "mysqecretpassword";
// const secretSalt = "asfdssgdsdkjldvhdsyudshfjsdfbjsdabfnwewbrfnefbkjsdb";

const user = {
    name:'ashish',
    id:1
}

const recivedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXNoaXNoIiwiaWQiOjEsImlhdCI6MTU1NzQwNjc5NH0.KBsa0rLk0Ae37_ZWpGghC4_L8sc_GudM4lWxDgNoW_A";


// if(user.token == recivedToken){
//     console.log("token is good")
// }

const token = jwt.sign(user,secret);
console.log(token)
const decodeToken = jwt.verify(recivedToken,secret);
console.log(decodeToken)