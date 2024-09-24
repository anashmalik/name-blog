import express from 'express';  
import router from './server/routers/router.js';  
import {connection} from './server/config/db.js'
import path from 'path'
import { fileURLToPath } from 'url';
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'views')));
app.use(router)
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

connection()