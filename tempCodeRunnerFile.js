import express from 'express'
import {router} from './server/routers/router.js'

const app=express()
const port=3000;
app.use(express.json());
app.use(router)
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
})
