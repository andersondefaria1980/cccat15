import express, { Express, Request, Response } from "express";
import accountRoute from './infra/http/route';

const app: Express = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded())
app.use('/', accountRoute);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
