const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qcwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('Travel_Agent');
        const placesCollection = database.collection('places');
        console.log('database connection done');

        // get api
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            console.log('get success');
            res.send(places);
        })

        // get single place
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific place ', id, req.params);
            const query = { _id: ObjectId(id) };
            const place = await placesCollection.findOne(query);
            console.log('single place getting done');
            res.json(place);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})