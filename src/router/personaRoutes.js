import express from 'express';

import { listarPersonas } from '../controllers/PersonaControllers.js';

const router = express.Router();


router.get('/listarpersona', listarPersonas);



export default router;
