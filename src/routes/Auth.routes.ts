import express from 'express';
const router= express.Router();
import {login, register, deleteUser, getAllUsers} from '../controllers/User.controller';
import { verifyJWT } from '../middlewares/verifyJWT.middleware';
import { verifyAdmin } from '../middlewares/verifyAdmin.middleware';


router.get('/users',
verifyAdmin,
 getAllUsers);
router.post('/register', register);
router.post('/login', 
verifyJWT, login);
router.patch('/delete/:id', verifyAdmin, deleteUser);



export default router;