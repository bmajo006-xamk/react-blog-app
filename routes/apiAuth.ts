import express, { NextFunction } from 'express';
import { Virhe } from '../errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';


const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async(req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> => { 

    try {

        //haetaan käyttäjän tiedot, ei salasanaa mukaan (samalla käyttäjätunnuksella saattaa olla useampi)
        const kayttaja = await prisma.kayttaja.findFirst({
                    where: {
                        kayttajatunnus : req.body.kayttajatunnus
                    }
        });

        //ensin katotaan, että onko tällaista käyttäjää olemassa ja sen jälkeen varmistetaan, että täsmääkö salasana
        if (req.body.kayttajatunnus === kayttaja?.kayttajatunnus){
            if (require("crypto").createHash("SHA256").update(req.body.salasana).digest("hex") === kayttaja?.salasana){
                //pailoadiin kayttajan tietoja
                let token = jwt.sign({id : kayttaja?.id, kayttajatunnus : kayttaja?.kayttajatunnus }, String(process.env.ACCESS_TOKEN_KEY));

                res.json({ token : token })

            } else {
                next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
            }
        }else {
            next(new Virhe(401, "Virheellinen käyttäjätunnus tai salasana"));
        }
    }catch (e: any){

        next(new Virhe());

    }

});

apiAuthRouter.post("/register", async(req: express.Request, res: express.Response, next: NextFunction) => {

        try {

            const kayttaja = await prisma.kayttaja.findFirst({
                    where : {
                        kayttajatunnus : req.body.kayttajatunnus
                    }
            });

            if (!kayttaja) {

                    await prisma.kayttaja.create({
                        data : {
                            kayttajatunnus : req.body.kayttajatunnus,
                            salasana : require("crypto").createHash("SHA256").update(req.body.salasana).digest("hex")
                        }
                    })

                    res.json({"onnistui" : "onnistui"})
                    

            } else {
                    next(new Virhe(409, "Käyttäjätunnus on jo olemassa"));
            }

        } catch (e : any){

            next(new Virhe());
        }



});

export default apiAuthRouter;