import express from 'express';
import multer from 'multer';
import { userModel, blogDb, Role, RHashP, Cat } from '../config/db.js'
import jsonwebtoken from 'jsonwebtoken'
import { jwtDecode } from "jwt-decode";
import { Op } from 'sequelize';
import fs from 'fs';
import bcrypt from 'bcrypt';
import {schema} from './joi_val.js'
const jwt = jsonwebtoken;
const pr = express.Router();

const storage = multer.diskStorage({
    destination: './views/images',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = await multer({
    storage: storage,
    limits: { fileSize: 10000000 },
}).single('image');

pr.post('/author', async (req, res) => {
    const { token } = req.body;
    const pos = await jwtDecode(token);
    return res.json(pos)
}).post('/a_id', async (req, res) => {
    const { token } = req.body;
    const pos = await jwtDecode(token);
    return res.json(pos.id)
}).post('/u_id', async (req, res) => {
    try {
        const { b_id } = req.body;
        const pos = await blogDb.findOne({ where: { b_id: b_id } })
        return res.status(200).json(pos.dataValues.a_id)

    } catch (error) {
        return res.status(401).json(error)
    }

}).post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ where: { username: username } });
    const JWT_SECRET = 'xyz7890'
    if (user) {
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send("Wrong Password");
        const token = jwt.sign({ id: user.id, username: user.username, pos: user.position, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        return res.json(token);
    }
    else {
        res.status(401).send('Invalid username or password');
    }
}).post('/api/addblog', async (req, res) => {
    try {
        const { token } = req.body;
        const pos = await jwtDecode(token);
        const permi = await RHashP.findAll({ where: { r_id: pos.pos, p_id: 2 } })
        if (permi.length == 0) {
            return res.status(403).json({ "message": "you are not allowed " })
        }
        //console.log(b_id,a_id,title,desc,st,imagePath);

        const blog = await blogDb.create(req.body);
        return res.status(200).json(blog);
    }
    catch (e) {

        return res.status(401).json(e)
    }


}).post('/api/openBlog', async (req, res) => {
    try {
        const { b_id } = req.body;
        const blog = await blogDb.findOne({ where: { b_id: b_id } });
        if (blog) {
            res.status(200).json(blog);
        }
        else
            res.status(400).send("blog not found")
    } catch (error) {
        res.status(400).send("blog not found")
    }
}).post('/add_user', async (req, res) => {
    try {
        const { token } = req.body;
        const {name, username ,password ,confirmPassword} =req.body;
        const { error } = schema.validate({name, username ,password ,confirmPassword});
        if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const pos = await jwtDecode(token);
        const permi = await RHashP.findAll({ where: { r_id: pos.pos, p_id: 6 } })
        if (permi.length == 0) {
            return res.status(403).json({ "message": "you are not allowed to add user" })
        }
        const { position } = req.body;
        const u = await userModel.create({ name, username, password: bcrypt.hashSync(password, 8), position });
        return res.status(200).json({ "message": "user created" });
    } catch (e) {
        // let m=""
        // e= await e.json();
        // console.log(e.errors[0].message)
        // (e.errors)
        console.log(e);
        return res.status(401).json({ "message": e.errors[0].message })
    }
}).post('/api/BlogDe', async (req, res) => {
    try {
        const { b_id } = req.body;
        const blog = await blogDb.findOne({ where: { b_id: b_id } });
        if (blog) {
            try {
                await blogDb.update({ st: false }, { where: { b_id: b_id } });
                res.status(200).send("blog deactivate")
            }
            catch (e) {
                //console.log(e);
            }
        }



    } catch (error) {
        res.status(400).json(error)
    }
}).post('/api/allBlog', async (req, res) => {
    const result = await blogDb.findAll({
        where: { st: true }, order: [
            ['createdAt', 'DESC']
        ]
    });
    if (result.length == 0) {
        return res.status(200).json({ "error": "data not" });
    }
    else
        return res.status(200).json(result);
}).post('/allBlog', async (req, res) => {
    const { a_id } = req.body;
    const result = await blogDb.findAll({ where: { a_id: a_id } });
    if (result.length == 0) {
        return res.status(200).json({ "error": "data not" });
    }
    else
        return res.status(200).json(result);
}).post('/find_blog', async (req, res) => {
    try {
        const { b_id } = req.body;
        const result = await blogDb.findOne({ where: { b_id: b_id } });
        if (result.length != 0) {
            return res.status(200).json(result.dataValues)
        }
    } catch (error) {
        return res.status(500)
    }
}).put('/api/edit', async (req, res) => {
    try {
        const { token, b_id } = req.body;
        const pos = await jwtDecode(token);
        const permi = await RHashP.findAll({ where: { r_id: pos.pos, p_id: 6 } })
        const n = await blogDb.update(req.body, { where: { b_id: b_id } });
        return res.status(200).json(n);
    } catch (error) {
        return res.status(500).json({ "message": "not updated" });
    }
}).post('/api/upload', async (req, res) => {
    await upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                res.json({
                    message: 'Image uploaded!',
                    file: `images/${req.file.originalname}`
                });
            }
        }
    });
}).post('/api/create-role', async (req, res) => {
    const { role_name, permissions, token } = req.body;

    let r_id = null;
    const pos = await jwtDecode(token);
    const permi = await RHashP.findAll({ where: { r_id: pos.pos, p_id: 11 } })
    if (permi.length == 0) {
        return res.status(403).json("you are not allowed to create role")
    }
    try {
        const newR = await Role.create({ name: role_name });
        r_id = newR.r_id;
        //console.log(newR.r_id)
    } catch (error) {
        return res.status(401).json("Role name must be uique")
    }
    if (r_id) {  // console.log(permissions)
        try {

            permissions.forEach(element => {
                RHashP.create({ r_id: r_id, p_id: element });
            });

        } catch (error) {
            return res.status(402).json(error);
        }
    }
    res.status(200).json("sucessfull")
}).post('/api/all_role', async (req, res) => {
    try {
        let ans = await Role.findAll();
        //console.log(ans);
        return res.status(200).json(ans);
    } catch (error) {
        return res.status(402).json(error)
    }


}).post('/api/permission', async (req, res) => {
    try {
        const { pos } = req.body;
        let arr = await RHashP.findAll({
            attributes: ['p_id'],
            where: { r_id: pos }
        });
        return res.status(200).json(arr)
    } catch (error) {
        return res.status(402).send(error)
    }


}).post('/api/role', async (req, res) => {
    try {
        const { pos } = req.body;
        let arr = await Role.findAll({
            where: { r_id: pos }
        });
        // console.log(arr);
        return res.status(200).json(arr)
    } catch (error) {
        return res.status(402).send(error)
    }


}).post('/api/all_user', async (req, res) => {
    let re = await userModel.findAll({
        attributes: ['id', 'name']
    },);
    if (re.length > 0) {
        return res.status(200).json(re)
    }
    else {
        return res.send("no user Present")
    }

}).post('/per_to_del', async (req, res) => {
    try {
        const { r_id } = req.body;
        const k = await RHashP.findAll({ where: { r_id: r_id, p_id: 8 } })
        if (k.length > 0) return res.status(200).json(true);
        res.status(200).json(false)
    } catch (error) {
        return res.status(401).json(error)
    }


});


export default pr;