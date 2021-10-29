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

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('Travel_Agent');
        const placesCollection = database.collection('places');
        const usersCollection = database.collection('users');
        console.log('database connection done');

        // get api
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            console.log('get success');
            res.send(places);
        })

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            console.log('user getted');
            res.send(users);

        })

        // get single item
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific place ', id, req.params);
            const query = { _id: ObjectId(id) };
            const place = await placesCollection.findOne(query);
            console.log('single place getting done');
            res.json(place);
        })


        // post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const oldUser = await usersCollection.findOne({ email: newUser.email });

            if (oldUser) {
                res.json(oldUser);
                console.log('old user');
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                console.log('added new user');
                res.json(result);
            }

        })

        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log('deleting user with id', result);
            res.json(result);
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