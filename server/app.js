import express from 'express';
import Result from "./utils/result.js";
import router from "./router/index.js";
global.Result = Result;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router, (req, res, next) => {
  console.log('Time:', Date.now());
});

app.get('/', (req, res) => {
  res.send('Hello World!');
})


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
