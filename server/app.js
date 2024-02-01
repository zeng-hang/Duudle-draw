import express from 'express';
import Result from "@/utils/result.js";
import router from "@/router/index.js";
import createSocketIo from "@/utils/socketIo";

global.Result = Result;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

const httpServer = createSocketIo(app);
httpServer.listen(3000, () => {
  console.log('服务已启动：http://localhost:3000')
});
