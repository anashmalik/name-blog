import express from 'express';
import multer from 'multer';
import { userModel, blogDb, Role, RHashP, Cat } from '../config/db.js'
import jsonwebtoken from 'jsonwebtoken'
import { jwtDecode } from "jwt-decode";
import { Op } from 'sequelize';
const jwt = jsonwebtoken;
const router = express.Router();
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
router.get('/', async (req, res) => {

    const result = await blogDb.findAll({
        where: { st: true }, order: [
            ['createdAt', 'DESC']
        ],limit:5
    });
    if (result.length == 0) {
        res.render('inde', { blogs: [], counter: 1 })
    }
    else
        res.render('inde', { blogs: result, counter: 1 })
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

}).get('/myblog', async (req, res) => {
    const token = req.query.param1;
    const user = await jwtDecode(token);
    const a_id = user.id;
    const result = await blogDb.findAll({ where: { a_id: a_id } });
    if (result.length == 0) {
        res.render('myblog', { blogs: [], deact: "" })
    }
    else
        res.render('myblog', { blogs: result, deact: "" })

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
}).get('/about',async(req,res)=>{
    res.render('about');
}).get('/term',async(req,res)=>{
    res.render('terms')
}).get('/help',async(req,res)=>{
    res.render('help')
}).get('/privacy',async(req,res)=>{
    res.render('privacy')
}).get('/contact',async(req,res)=>{
    res.render('contact_us')
}).post('/add/category', async(req, res) => {
    const {catt} = req.body;
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
}).post('/author', async (req, res) => {
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
    const user = await userModel.findOne({ where: { username: username, password: password } });
    const JWT_SECRET = 'xyz7890'
    if (user) {
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
        const pos = await jwtDecode(token);
        const permi = await RHashP.findAll({ where: { r_id: pos.pos, p_id: 6 } })
        if (permi.length == 0) {
            return res.status(403).json({ "message": "you are not allowed to add user" })
        }
        const u = await userModel.create(req.body);
        return res.status(200).json({ "message": "user created" });
    } catch (e) {
        // let m=""
        // e= await e.json();
        // console.log(e.errors[0].message)
        // (e.errors)
        return res.status(401).json({ "message": (e.errors[0].message) })
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


}).delete('/api/delete_user', async (req, res) => {
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
        res.status(400).json(error)
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
})
export default router;