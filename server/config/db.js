// const { Pool } = require('pg');

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: 5432,
// });

// module.exports = pool;

import { Sequelize } from "sequelize";
import  {createuser,createblog,createrole,createHash,categorytb} from '../models/userschema.js'
const sequelize = new Sequelize('demo_kvtu', 'demo_kvtu_user', 'Mi0GJjFZ8mAGK7KNI2OMYlY90PQBSWSF', {
    host: 'dpg-crr67bg8fa8c73el4vk0-a',
    dialect: 'postgres',
    logging:false
});
let userModel=null;
let blogDb=null;
let Role=null;
let RHashP=null;
let Cat=null;
const connection=async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        userModel= await createuser(sequelize);
        blogDb =await createblog(sequelize);
        Role= await createrole(sequelize);
        RHashP =await createHash(sequelize);
        Cat=await categorytb(sequelize)
        await sequelize.sync();
        console.log("database synced")
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
export{
    connection,userModel,blogDb,Role,RHashP,Cat
}
