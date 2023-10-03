import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittelija';
import sanitizeHtml from "sanitize-html";


const apiYllapitoRouter = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiYllapitoRouter.use(express.json());

apiYllapitoRouter.post("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
   
    try {


        await prisma.blogiteksti.create({
            data: {
                otsikko : req.body.otsikko,
                sisalto : sanitizeHtml(req.body.sisalto),
                kuva : req.body.kuva || "Norja",
                kayttajaId : Number(res.locals.kayttaja.id),
                kayttaja : String(res.locals.kayttaja.kayttajatunnus),
                tykkaykset : Number(req.body.tykkaykset) || 0,
                eiTykkaykset : Number(req.body.eiTykkaykset) || 0,
                julkaistu : Boolean(req.body.julkaistu) || false           }
        })

        res.json(await prisma.blogiteksti.findMany({
            where : {
                kayttajaId : Number(res.locals.kayttaja.id)
            },
            orderBy : [
            {
                createdAt: 'desc'
            }]
        }));

    } catch (e: any){

        next(new Virhe());
    }

});

apiYllapitoRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {

        res.json(await prisma.blogiteksti.findMany({
            where : {
                kayttajaId : Number(res.locals.kayttaja.id)
            },
            orderBy : [
            {
                createdAt: 'desc'
            }]
        }));

    }catch (e: any){
        next( new Virhe());

    }
});

apiYllapitoRouter.delete("/:id", async(req: express.Request, res: express.Response, next: express.NextFunction) => {

    
    if (await prisma.blogiteksti.count({
        where : {
            id : Number(req.params.id)
        }
    })) try{

        await prisma.blogiteksti.delete({
            where : {
                id : Number(req.params.id)
            }
        });

        res.json(await prisma.blogiteksti.findMany({
            where : {
                kayttajaId : Number(res.locals.kayttaja.id)
            },
            orderBy : [
            {
                createdAt: 'desc'
            }]
        }));

    } catch(e: any){

        next(new Virhe());
    } else {
        next(new Virhe(400, "Blogitekstiä ei löydy"));
    }

})
apiYllapitoRouter.put("/:id", async(req: express.Request, res: express.Response, next: express.NextFunction) => {

    try{

        const blogiteksti = await prisma.blogiteksti.findUnique({
                            where : {
                                id : Number(req.params.id)
                            }
                            })

        await prisma.blogiteksti.update({
            where : {
                id : Number(req.params.id)
            },  data : {
                otsikko : req.body.otsikko || blogiteksti?.otsikko,
                sisalto : sanitizeHtml(req.body.sisalto) || blogiteksti?.sisalto,
                kuva : req.body.kuva || blogiteksti?.kuva,
                julkaistu : req.body.julkaistu

            }
        });

        res.json(await prisma.blogiteksti.findMany({
            where : {
                kayttajaId : Number(res.locals.kayttaja.id)
            },
            orderBy : [
            {
                createdAt: 'desc'
            }]
        }));
        

    }catch(e: any){

        next(new Virhe());

    } 
})
export default apiYllapitoRouter;