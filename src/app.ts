import express from 'express';
import { UserController } from './controllers/UserController';
import { errorHandler } from './middleware/errorHandler';
import { AuthController } from './controllers/AuthController';
import { RecipientController } from './controllers/RecipientController';
import { TransactionController } from './controllers/TransactionController';
const authenticateJWT = require('./middleware/authenticateJWT');

const app = express();

// Middleware para parsear el cuerpo de la solicitud en formato JSON
app.use(express.json());

// Middleware para autenticar el token JWT en todas las rutas, excepto en /login y /register
app.use((req, res, next) => {
    if (['/login', '/register', '/'].indexOf(req.path) !== -1) {
        next();
    } else {
        authenticateJWT(req, res, next);
    }
});

// Ruta para verificar que el servicio este corriendo
app.get('/', (req, res) => {
    res.send("Services Running...");
});

// Rutas usuarios
app.post('/register', UserController.createUser);
app.post('/login', AuthController.loginUser);
app.get('/user/:userId', UserController.getUser);

// Rutas destinatarios
app.post("/recipients", RecipientController.createRecipient);
app.get("/recipients/:userId", RecipientController.getRecipientsByUserId);
app.delete("/recipients/:recipientId", RecipientController.deleteRecipient);

// Rutas transacciones
app.post("/transactions", TransactionController.createTransaction);
app.get("/transactions/:accountId", TransactionController.getTransactionsByAccountId);

// Middleware errores
app.use(errorHandler);

export default app;
