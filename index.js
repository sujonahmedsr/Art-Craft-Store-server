const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.kmaa4nd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const artCollections = client.db('ArtsDb').collection('arts');


    // for read data 
    app.get('/arts', async(req, res)=>{
        const cursor = artCollections.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // for single data 

    app.get('/arts/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await artCollections.findOne(query);
      res.send(result)
    })

    // create data 
    app.post('/arts', async(req, res)=>{
        const newArts = req.body;
        const result = await artCollections.insertOne(newArts)
        res.send(result)
        console.log(newArts, result);
    })

    












    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req, res) => {
    res.send('loading ....')
})

app.listen(port, ()=>{
    console.log(`running with this port : ${port}`)
})