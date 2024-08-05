import { Router } from 'express';
import { fakerES_MX as faker } from "@faker-js/faker";

export const router = Router();

router.get('/',(req,res)=>{
    let productos = [];

     for (let i = 0; i < 100; i++) {
        let title = faker.commerce.productName();
        let code = faker.database.mongodbObjectId();
        let price = faker.commerce.price();
        let stock = faker.number.int();
        productos.push({ title, code, price, stock });
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(productos);
});


