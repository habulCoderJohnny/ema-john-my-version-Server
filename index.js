//const packageName = require('packageName');
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q7eq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run () {
    try{
        await client.connect(); //client.connect 
        const productCollection = client.db("Ema-John").collection("product");   
        //perform actions on the collection object

        //inital data get/count/page/query
        app.get('/product', async (req,res) =>{
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                /*0 --> skip: 0 get: 0-10(10): 
                 1 --> skip: 1*10 get: 11-20(10):
                 2 --> skip: 2*10 get: 21-30 (10):
                 3 --> skip: 3*10 get: 21-30 (10):*/
               products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();  
            }
            res.send(products);
        });

        //count Data (see total number of data) FOR Pagination
        app.get('/productCount', async(req,res)=>{
            const count = await productCollection.estimatedDocumentCount();
            res.send({count}); //sent to as a object
        });

        // USE POST TO GET PRODUCTS BY ID's
        app.post('/productByKeys', async(req, res) =>{
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = {_id: {$in: ids}}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log(keys);
            res.send(products);
        })
    }
    finally{}
    
}
// call the async finction
run().catch(console.dir);


//log 
app.get('/', (req,res)=>{
    res.send('Running amazon server...');
});

app.listen(port,()=>{
    console.log('Listening.....port', port );
})