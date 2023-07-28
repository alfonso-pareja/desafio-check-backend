import express from 'express';
import { UserController } from './controllers/UserController';
import { errorHandler } from './middleware/errorHandler';
import { AuthController } from './controllers/AuthController';
import { RecipientController } from './controllers/RecipientController';
import { TransactionController } from './controllers/TransactionController';
const app = express();
const authenticateJWT = require('./middleware/authenticateJWT');

app.use(express.json());
app.use((req, res, next) => {
    if (['/login', '/register', '/'].indexOf(req.path) !== -1) next();
    else {
        authenticateJWT(req, res, next);
    }
});


app.get('/', async(req, res) => { res.send("Services Running...") });
app.post('/register', UserController.createUser)
app.post('/login',  AuthController.loginUser)
app.get('/user/:id',     UserController.getAllUsers)

app.post("/recipients", RecipientController.createRecipient);
app.get("/recipients/:userId", RecipientController.getRecipientsByUserId);

app.post("/transactions", TransactionController.createTransaction);


app.use(errorHandler);

export default app;
