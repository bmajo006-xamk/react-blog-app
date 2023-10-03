import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Virhe } from '../errors/virhekasittelija';


const apiBlogitekstitRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiBlogitekstitRouter.use(express.json());

apiBlogitekstitRouter.put("/:id", async(req: express.Request, res: express.Response, next: express.NextFunction) => {

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
                tykkaykset : req.body.tykkaykset,
                eiTykkaykset : req.body.eiTykkaykset,
                updatedAt : blogiteksti?.updatedAt

            }
        });
        res.json(await prisma.blogiteksti.findMany({
            orderBy : [ 
            {
                createdAt: 'desc'
            }]
        }));
        

    }catch(e: any){

        next(new Virhe());

    }
});

apiBlogitekstitRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {

        res.json(await prisma.blogiteksti.findMany({
            orderBy: [
            {
                createdAt: 'desc'
            }]
            
        }));

    }catch (e: any){
        next( new Virhe());


    }
});



export default apiBlogitekstitRouter;