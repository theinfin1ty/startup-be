import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import mongoose  from 'mongoose';

config();

const app = express();

mongoose.connect(process.env.DB_URI as string);


app.all('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`)
});