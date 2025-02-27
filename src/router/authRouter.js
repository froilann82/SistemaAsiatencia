import { Router } from 'express';

import { handleRolesAndIdPersona } from '../controllers/authControllers.js';

import multer from 'multer';

const router = Router();


router.all('/roles-handler', handleRolesAndIdPersona);





export default router;
