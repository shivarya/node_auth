const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SALT_I = 10;

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    token:String
})

userSchema.pre("save", function(next){
    if (this.isModified('password')){
        bcrypt.genSalt(SALT_I, (err, salt) => {
            if (err) next(err)
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) next(err)
                this.password = hash;
                next()
            })
        })
    }else{
        next()
    }
})


userSchema.methods.generateToken = function(callback){
    let user = this
    let token = jwt.sign(user._id.toHexString(),"supersecret")
    user.token = token;
    user.save((err,user) => {
        if (err) return callback(err)
        callback(null,user)
    })
}

userSchema.methods.comparePasswords = function (candidatePassword,callback) {
    bcrypt.compare(candidatePassword, this.password, (err, matched) => {
        if (err) callback(err)
        callback(null, matched)
    })
}

userSchema.statics.findByToken = function(token,cb){
    const user = this;
    jwt.verify(token, "supersecret", (err, user_id) => {
        if(err) cb(err)
        user.findOne({"_id":user_id,"token":token}, (err,user) => {
            if (err) cb(err)
            cb(null,user)
        })
    });
    
}

const User = mongoose.model('User',userSchema);

module.exports = User;