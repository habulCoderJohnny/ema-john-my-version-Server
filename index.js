//const packageName = require('packageName');
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
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
        const productCollection = client.db("Ema-John").collection("product");   //perform actions on the collection object

        //inital data get
        app.get('/product', async (req,res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            //const products = await cursor.limit(10).toArray();
            res.send(products);
        });

        //count Data (see total number of data) FOR Pagination
        app.get('/productCount', async(req,res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const count = await cursor.count();
            res.send({count}); //sent to as a object
        });


    }
    finally{

    }
      



}
// call the async finction
run().catch(console.dir);
console.log('wow! mongodb is conncted to server')    


//log 
app.get('/', (req,res)=>{
    res.send('Running amazon server...');
});

app.listen(port,()=>{
    console.log('Listening.....port', port );
})