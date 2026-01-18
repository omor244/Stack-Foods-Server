require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = 3001 || process.env.PORT 


app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    const db = client.db("Stack-Foods")
    const allFoodscoll = db.collection('AllFoods')
    const usercoll = db.collection('users')
    try {

     

  
        app.post('/foods', async (req, res) => {
     
            const data = req.body 
            const result = await allFoodscoll.insertOne(data)
            res.send(result)         
 })
        app.get('/limit', async (req, res) => {
     
            const result = await allFoodscoll.find().limit(4).toArray()
            
            res.send(result)         
 })
        app.get('/foods', async (req, res) => {
     
            const result = await allFoodscoll.find().toArray()
            
            res.send(result)         
 })
        app.get('/foods/:id', async (req, res) => {
            
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await allFoodscoll.findOne(query)
            
            res.send(result)         
 })
        app.get('/user', async (req, res) => {
            
            const email = req.query.email
          
            const result = await usercoll.findOne({email: email})
            
            res.send(result)         
 })


        // post user

        app.post('/register', async (req, res) => {

            const data = req.body

            const isexist = await usercoll.findOne({ email: data?.email })
            
            if (isexist) {
                res.send({ massage: "This email already have used" }) 
            }
            else {
                const result = await usercoll.insertOne(data)
                res.send(result)
           }

        
        })





        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 })
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        )
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
