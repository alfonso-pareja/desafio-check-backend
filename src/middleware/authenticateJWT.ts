const jwt = require("jsonwebtoken");
import { DEFAULT_HEADERS } from '../utils/constants';

/**
 * Middleware para autenticar un token JWT en la solicitud.
 * @param req La solicitud HTTP recibida.
 * @param res La respuesta HTTP a enviar.
 * @param next La funcion para pasar al siguiente middleware en caso de exito.
 */
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.set(DEFAULT_HEADERS).status(403).json({ statusCode: 403, message: "Invalid token" });
  
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.set(DEFAULT_HEADERS).status(403).json({ statusCode: 403, message: "Invalid token" });
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
