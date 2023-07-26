import express from 'express';
import { UserController } from './controllers/UserController';
const app = express();


app.get('/', async(req, res) => { res.send("Services Running...") });
app.get('/user/:id', UserController.getAllUsers)



export default app;
