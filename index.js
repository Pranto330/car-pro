const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')

require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors({
  origin : ['http://localhost:5173'],
  credentials : true
}))
app.use(express.json())


// car537
// tU6YQK24SpEZ7ZPB

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1s4xu.mongodb.net/?appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serviceCollection = client.db('carPro').collection('services')
    const bookCollection = client.db('carPro').collection('books')

    // auth related api
     app.post('/jwt', async(req, res)=>{
      const user = req.body
      console.log(user)
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRE, {expiresIn:'1h'})
      res
      .cookie('token', token, {
        httpOnly:true,
        secure:false,
        sameSite:'none'
      })
      .send({success :true})
     })
   
  
    
    //  services

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { title: 1, price: 1, service_id: 1, img: 1 }
      }
      const result = await serviceCollection.findOne(query, options)
      res.send(result)
    })


    app.get('/services', async (req, res) => {
      // let query = {}
      // if (req.query?.email) {
      //   query = { email: req.query.email }
      // }
      const cursor = serviceCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    //  Bookings

    app.patch('/books/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updatebooking = req.body
      console.log(updatebooking)
      const updateDoc = {
        $set: {
          status: updatebooking.status
        },
      }
      const result = await bookCollection.updateOne(filter, updateDoc)
      res.send(result)

    })
    app.delete('/books/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await bookCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/books',async (req, res) => {
     
      
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = bookCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.post('/books', async (req, res) => {
      const book = req.body
      console.log(book)
      const result = await bookCollection.insertOne(book)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('doctor is running')
})
app.listen(port, () => {
  console.log(`car doctor is running on port ${port}`)
})