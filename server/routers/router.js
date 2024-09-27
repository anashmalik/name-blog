import express from 'express';
import multer from 'multer';
import { userModel, blogDb, Role, RHashP, Cat } from '../config/db.js'
import jsonwebtoken from 'jsonwebtoken'
import { jwtDecode } from "jwt-decode";
import { Op } from 'sequelize';
import fs from 'fs';
import bcrypt from 'bcrypt';
const jwt = jsonwebtoken;
const router = express.Router();
router.delete('/api/delete_user', async (req, res) => {
    try {
        const { id } = req.body;
        // console.log(id)
        const u = await userModel.findOne({ where: { id: id } });
        // console.log(u)
        if (u) {
            try {
                u.destroy()
                return res.status(200).json("user deleted")
            }
            catch (e) {
                return res.status(401).json("not deleted")
            }
        }
    } catch (error) {
        // console.log(error)
        res.status(500).json(error)
    }
}).delete('/api/delete', async (req, res) => {
    try {
        const { b_id } = req.body;
        const blog = await blogDb.findOne({ where: { b_id: b_id } });
        if (blog) {
            try {

                blog.destroy()
                res.status(200).send("blog deleted")
            }
            catch (e) {
                res.status(401).send("not deleted")
            }
        }
    } catch (error) {
        res.status(500).json("server error")
    }
}).delete('/delete', (req, res) => {
    // const filename = req.params.filename;
    const { filename } = req.body;
    // const filePath = path.join(__dirname, 'views/images', filename);
    console.log(filename)
    fs.unlink(filename, (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Failed to delete the image' });
        }
        res.json({ message: 'Image deleted successfully' });
    });
}).delete('/delete_cat', async (req, res) => {
    try {
        const { name } = req.body;
        const r = await Cat.findOne({ where: { category_name: name } })
        if (r) {
            try {
                r.destroy()
                return res.status(200).json("Category deleted")
            }
            catch (e) {
                return res.status(500).json("Category not deleted")
            }
        }
    }
    catch (e) {
        res.status(500).json("Server Error")
    }

}).delete('/api/delete-role',async(req,res)=>{
    const {r_id} =req.body;
    let role = await Role.findOne({where:{r_id:r_id}});
    if(role){
        role.destroy();
       return res.status(200).json("Role Deleted Sucessfully")
    }
    return res.status(500).json("server error")
});
export default router;