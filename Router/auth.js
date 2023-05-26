const express = require('express');
const router = express.Router();
require('../DB/connection');
const { Content, User, BlogComment } = require('../Models/blogSchema');
const bcrypt = require('bcryptjs');
const cors = require('cors');


router.get('/blogs',cors(), async(req, res) => {
    try {
        const allBlogs = await Content.find({})
        res.status(200).send({data:allBlogs});
    } catch (error) {
        console.log(error)
    }
})

router.post('/add', async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(422).json({ error: "Please filled the fields properly" });
    }

    try {
        const titleExist = await Content.findOne({ title: title });

        if (titleExist) {
            return res.status(422).json({ error: "Title already Exist" });
        }

        const content = new Content({ title, description });

        const newBlog = await content.save();

        if (newBlog) {
            res.status(201).json({ message: "New Blog Added Successfully" })
        }

    } catch (error) {
        console.log(error);
    }

})

router.post('/comment', async (req, res) => {
    console.log(req.body)
    const { blog_id,comment,authorName } = req.body;
    if (!comment || !blog_id) {
        return res.status(422).json({ error: "Please fill the fields properly" });
    }
    
    try {
        const newComment = new BlogComment({comment,authorName})
        await newComment.save();
        const result = await Content.findOneAndUpdate({_id:blog_id}, {$push: {comments:newComment}});
        res.status(201).json({ message: "New Comment Added Successfully" })
        
    }catch (error) {
        console.log(error);
    }

})

router.post('/comments', async (req, res) => {
    console.log(req.body)
    const {blog_id} = req.body;
    if (!blog_id) {
        return res.status(422).json({ error: "Please fill the fields properly" });
    }
    
    try {
        const content = await Content.findOne({ _id: blog_id });
        const commentArray = content.comments
        const records = await BlogComment.find({ '_id': { $in: commentArray } });
        res.status(200).json({ records })
        
    }catch (error) {
        console.log(error);
    }

})

router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please filled the fields properly" });
    }

    try {
        const emailExist = await User.findOne({ email: email });

        if (emailExist) {
            return res.status(422).json({ error: "email already Exist" });
        }
        else if (password != cpassword) {
            return res.status(422).json({ error: "email already Exist" });
        }

        else {
            const user = new User({ name, email, phone, work, password, cpassword });

            const newUser = await user.save();

            if (newUser) {
                res.status(201).json({ message: "New User Created Successfully" })
            }
        }

    } catch (error) {
        console.log(error);
    }

})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill the fields properly" });
    }

    try {
        let token;
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log(token)
            res.cookie("jwtoken",token,{
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" });
            }
            else {
                return res.status(200).json({ message: "user sign in successfully" });
            }
        }
        else{
            return res.status(400).json({ error: "Invalid Credentials" });
        }

    } catch (error) {
        console.log(error);
    }

})

module.exports = router;
