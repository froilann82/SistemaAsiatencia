import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const requiredAuth = (req, res, next) =>{



const {token} = req.cookies;

if(!token)
    return res.status(401).json({mensage: "No token Autorizado"});

    jwt.verify(token, TOKEN_SECRET, (err, user) =>{
      
        if(err) res.status(403).json({message: "Invalido Token"});
         req.user = user;
         next();
    });
}