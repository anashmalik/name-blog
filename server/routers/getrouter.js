import express from 'express';
import multer from 'multer';
import { userModel, blogDb, Role, RHashP, Cat } from '../config/db.js'
import jsonwebtoken from 'jsonwebtoken'
import { jwtDecode } from "jwt-decode";
import { Op, where } from 'sequelize';
import fs from 'fs';
import bcrypt from 'bcrypt';
const jwt = jsonwebtoken;
const gr = express.Router();
gr.get('/', async (req, res) => {

    const result = await blogDb.findAll({
        where: { st: true }, order: [
            ['createdAt', 'DESC']
        ], limit: 4
    });
    const re = await blogDb.findAll({
        where: { st: true }, order: [
            ['createdAt', 'DESC']
        ], limit: 7
    });
    if (result.length == 0) {
        res.render('inde', { blogs: [],blogs2:[], counter: 1 })
    }
    else
        res.render('inde', { blogs: result,blogs2:re, counter: 1 })
}).get('/home', async (req, res) => {
    const limit = 4;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const page2 = req.query.page2 ? parseInt(req.query.page2) : 1;
    const offset = (page - 1) * limit;
    const offset2 = (page2 - 1) * (limit + 2);
    const count = await blogDb.count();
    let re;
    let cat, result;
    if (req.query.go) {
        const go = req.query.go;
        result = await blogDb.findAll({
            limit: 7,
            where: { st: true, category: go }, order: [
                ['createdAt', 'DESC']
            ],
        });
        re = await blogDb.findAll({
            limit: limit,
            offset: offset,
        });
    }
    else {
        result = await blogDb.findAll({
            limit: 7,
            where: { st: true }, order: [
                ['createdAt', 'DESC']
            ]
        });
        re = await blogDb.findAll({
            where:{st:true},
            limit: limit,
            offset: offset,
        });
    }
    cat = await Cat.findAll({
        attribute: ['category_name']
    });

    if (result.length == 0) {
        res.render('index', { blogs2: [], blogs: [], counter: 1, currentPage: page, totalPages: 0, cat: cat })
    }
    else
        res.render('index', { blogs2: re, blogs: result, counter: 1, currentPage: page, totalPages: (count / limit), cat: cat })
}).get('/allblog', async (req, res) => {

    const result = await blogDb.findAll({ where: { st: true } });
    if (result.length == 0) {
        res.render('allblog', { blogs: [], deact: "" })
    }
    else
        res.render('allblog', { blogs: result, deact: "" })
}).get('/openblog', async (req, res) => {
    const id = req.query.param1;
    //console.log(id);
    const result = await blogDb.findOne({ where: { b_id: id } });

    //console.log(result.dataValues)
    if (result.length != 0) {
        res.render('openblog', { blog: (result.dataValues) })
    }
    else {

        // res.redirect('/home');
    }

}).get('/delete_role', async (req, res) => {
const role =await Role.findAll();
if(role){
    res.render('delete_role',{role});
}
else {
    res.render('delete_role',{role:[]});
}    
}).get('/myblog', async (req, res) => {
    const token = req.query.param1;
    const user = await jwtDecode(token);
    const a_id = user.id;
    const result = await blogDb.findAll({ where: { a_id: a_id } });
    if (result.length == 0) {
        res.render('myblog', { blogs: [], deact: "" })
    }
    else {
        res.render('myblog', { blogs: result, deact: "" })
    }
}).get('/mydeactivate', async (req, res) => {
    const token = req.query.param1;
    const user = await jwtDecode(token);
    const a_id = user.id;
    const result = await blogDb.findAll({ where: { a_id: a_id, st: false } });
    if (result.length == 0) {
        res.render('myblog', { blogs: [], deact: "Deactivate" })
    }
    else
        res.render('myblog', { blogs: result, deact: "My Deactivate" })

}).get('/all_deactivate', async (req, res) => {
    const result = await blogDb.findAll({ where: { st: false } });
    if (result.length == 0) {
        res.render('allblog', { blogs: [], deact: "Deactivated" })
    }
    else
        res.render('allblog', { blogs: result, deact: "All Deactivated" })
}).get('/add_Blog', async (req, res) => {
    const result = await Cat.findAll({
        attribute: ['category_name']
    });
    if (result.length == 0) {
        res.render('blog', { cat: [] })
    }
    else
        res.render('blog', { cat: result })
}).get('/add_category', async (req, res) => {
    const result = await Cat.findAll({
        attribute: ['category_name']
    });
    if (result.length == 0) {
        res.render('add_cat', { cat: [] })
    }
    else
        res.render('add_cat', { cat: result })
}).get('/searchBlogs', async (req, res) => {
    const searchQuery = req.query.q;

    try {
        // Find all blogs where the title contains the search term
        const blogs = await blogDb.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${searchQuery}%`  // Case-insensitive search
                }
                ,st:true
            }
        });

        // Return the array of blogs as a JSON response
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}).get('/searchcategory', async (req, res) => {
    const searchQuery = req.query.q;

    try {
        // Find all blogs where the title contains the search term
        const blogs = await blogDb.findAll({
            where: {
                category: {
                    [Op.iLike]: `%${searchQuery}%`  // Case-insensitive search
                }
            }
        });

        // Return the array of blogs as a JSON response
        res.json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}).get('/about', async (req, res) => {
    res.render('about');
}).get('/term', async (req, res) => {
    res.render('terms')
}).get('/help', async (req, res) => {
    res.render('help')
}).get('/privacy', async (req, res) => {
    res.render('privacy')
}).get('/contact', async (req, res) => {
    res.render('contact_us')
}).get('/add_user', async (req, res) => {
    res.render('add_user')
}).get('/all_user', async (req, res) => {
    res.render('all_user')
}).get('/role', async (req, res) => {
    res.render('Role')
}).get('/login', async (req, res) => {
    res.render('login')
}).post('/add/category', async (req, res) => {
    const { catt } = req.body;
    try {
        const [category, created] = await Cat.findOrCreate({
            where: { category_name: catt }
        });

        if (created) {
            return res.status(200).json("Category created");
        } else {
            return res.status(200).json("Category Already Exist");
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json("server error");
    }
})

export default gr;
