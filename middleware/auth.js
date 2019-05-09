const User = require('../server/users')

let auth = (req,res,next) => {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) res.status(400).send(err)
        req.token = token;
        next()
    })
}

module.exports = auth