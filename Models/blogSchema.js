const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const blogContent = new mongoose.Schema({
    title:{
        type: String,
        required : true
    },
    category:[{
        type: String,
        required : true
    }],
    subCategory:[{
        type: String,
        required : true
    }],
    description:{
        type: String,
        required : true
    },
    authorName:{
        type: String,
        required : true
    },
    authorAvtar:{
        type: String,
        required : true
    },
    cover:{
        type: String,
        required : true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'BLOGCOMMENT'
    }]
},{
    timestamps: true
    
})

const commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:"this filed is required"
    },
    authorName:{
        type:String,
        required:"this filed is required"
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'CONTENT'
    }

},{
    timestamps: true
    
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
         type: String,
        required:true
    },
    phone: {
        type: Number,
        required:true
    },
    work: {
         type: String,
        required:true
    },
    password: {
         type: String,
        required:true
    },
    cpassword: {
         type: String,
         required:true
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]
})

// hashing password with the help of middleware
userSchema.pre('save', async function(next){
    console.log("inside");
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.password, 12);
    }
    next();
})

// generating jsonweb token

 userSchema.methods.generateAuthToken = async function (){
    try {
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
 }

const User = mongoose.model('USER', userSchema);

const Content = mongoose.model('CONTENT', blogContent);

const BlogComment = mongoose.model('BLOGCOMMENT', commentSchema);

module.exports = {User,Content,BlogComment}