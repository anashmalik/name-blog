const express=require('express')
const path=require('path')
const app=express()
const{Pool} =require('pg')
const ejs =require('ejs')
const { release } = require('os')
const port=3000;
require('dotenv').config();
// console.log(process.env.DB_USER);
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  
pool.connect((err,client,release)=>{
    if(err){
        return console.error(err)
    }
    client.query('select ',(err,result)=>{
        release()
        if(err){
           return console.error("error in query")
        }
        console.log(result)
    })
})

app.listen(port,()=>{
    console.log(`server started at ${port}`)
})