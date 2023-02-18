import express, { Request, Response } from 'express';
import { config } from 'dotenv';

config();

const app = express();

app.all('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`)
});
