const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const validator = require("validator")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
 phoneNumber: {
 type: String,
 
 },
  country: {
    type: String,
required: [true, "Please enter a country"],
  },
  date: {
    type: Date, 
   required: true, 
 },
  photo: String,
role: {
    type: String,
    enum: ["user", "admin"], 
    default: "admin", 
    select: false,
},
  password: {
    type: String,
    minlength: 5,
    required: [true, "Password is required please provide one for yourself"],
   select: false
},
  confirmPassword: {
    type: String,
    minlength: 5,
    //required: [true, "Please provide a confirmation to your password"],
    validate: {
        validator: function(val) {
          return  val === this.password;
        },
       
        message: "Password and confirmPassword do not match"
    }  
},
active : {
    type: Boolean,
    select: false,
    default: true
},


});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new/changed

  this.password = await bcrypt.hash(this.password, 12); // Hash password
  next();
});
userSchema.pre(/^find/, function(next) {
     this.find({active: {$ne: false}})
     
     next()
 })

userSchema.methods.comparePasswordInDb = async function(pswd, pswdDb) {
    return await bcrypt.compare(pswd, pswdDb)
 }




const User = mongoose.model('User', userSchema);

module.exports = User;
