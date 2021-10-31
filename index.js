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
        const bookingCollection = database.collection('booking');
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
            console.log('user geted');
            res.send(users);
        })

        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            console.log('book found');
            res.send(booking);
        })

        // get single item
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific booking ', id);
            const query = { _id: ObjectId(id) };
            const book = await placesCollection.findOne(query);
            console.log('single place getting done');
            res.json(book);
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

        app.post('/places', async (req, res) => {
            const newPlace = req.body;
            const result = await placesCollection.insertOne(newPlace);

            console.log('added place', newPlace);
            res.json(result);
        })


        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            console.log('booking added');
            res.json(result);
        })

        // Update api
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const updateBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    status: updateBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);

            console.log('updating booking', id);
            res.json(result);
        })

        // delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            console.log('deleting user with id', result);
            res.json(result);
        })

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);

            console.log('deleting booking with id', result);
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