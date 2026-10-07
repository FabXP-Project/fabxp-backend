
import 'dotenv/config'
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express'
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth
} from '@clerk/clerk-sdk-node'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


// Public route
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

