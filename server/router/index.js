import { Router } from 'express';
import { addUser } from "../store/user.js";

const router = Router();

router.post('/user/add', async (req, res, next) => {
  const user = await addUser(req.body);
  next()
});


export default router;
