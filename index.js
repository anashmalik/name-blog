import express from 'express';  
import router from './server/routers/router.js';  
import gr from './server/routers/getrouter.js';
import pr from './server/routers/postrouter.js';  
import {connection} from './server/config/db.js'
import path from 'path'
import { fileURLToPath } from 'url';
const app = express();
await connection()
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'views')));
app.use(gr)
app.use(pr)
app.use(router)

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

