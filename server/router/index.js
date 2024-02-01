import { Router } from 'express';
import { addUser } from "../store/user.js";

const router = Router();

router.post('/user/add', (req, res) => {
  Result.execAndSend(() => addUser(req.body), res);
});


export default router;
