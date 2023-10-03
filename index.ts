// Aloita ohjelmointi tähän tiedostoon
import express from 'express';
import path from 'path';
import apiBlogitekstitRouter from './routes/apiBlogitekstit';
import apiYllapitoRouter from './routes/apiYllapito';
import apiAuthRouter from './routes/apiAuth';
import virhekasittelija from './errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app : express.Application = express();

const portti : number = Number(process.env.PORT);

const checkToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    try{

    let token : string = req.headers.authorization!.split(" ")[1];

    //tallennetaan muuttujaan kayttajan tietoja --> puretaan
    res.locals.kayttaja = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY));

    next();
    }catch (e: any){

        res.status(401).json({});
    }

}

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/blogitekstit", apiBlogitekstitRouter);
app.use("/api/yllapito", checkToken, apiYllapitoRouter);
app.use("/api/auth", apiAuthRouter);

app.use(virhekasittelija);

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin : ${portti}`);
})


