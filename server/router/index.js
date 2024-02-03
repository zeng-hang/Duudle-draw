import { Router } from 'express';
import { addUser } from "@/store/user.js";
import {getRandomQuestion} from "@/store/questions";

const router = Router();

router.post('/user/add', (req, res) => {
  Result.execAndSend(() => addUser(req.body), res);
});

router.post('/randomQuestion', (req, res) => {
  Result.execAndSend(() => getRandomQuestion(), res);
});

export default router;
