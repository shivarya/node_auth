const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://localhost:27017/auth`, { useNewUrlParser: true})

const User = require('./users')
const auth = require('../middleware/auth')

const app = express();
app.use(bodyParser.json())
app.use(cookieParser())

app.post('/api/user',(req,res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    })

    user.save((err,doc) => {
        if (err) res.status(400).send(err)
        res.status(200).send(doc)
    })
});

app.post('/api/user/login', (req, res) => {    
    User.findOne({'email':req.body.email}, (err,user) => {
        if (err) res.status(400).send(err)
        if(!user) {
            res.json({
                msg : "Auth Failed, User not found"
            })
        }else{
            user.comparePasswords(req.body.password, (err, matched) => {
                if (err) res.status(400).send(err)
                if (matched) {
                    user.generateToken((err, user) => {
                        if (err) res.status(400).send(err)
                        res.cookie('auth', user.token).json({
                            msg: "Logged In"
                        })
                    })
                } else {
                    res.json({
                        msg: "Auth Failed, Incorrect Pasword"
                    })
                }
            })
        }        
    })
});

app.get('/api/user/profile', auth, (req,res) => {
    res.status(200).send(req.token)
})


const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`App running on port ${port}`)
})