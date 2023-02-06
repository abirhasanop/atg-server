const express = require('express')
const cors = require("cors")
const bcrypt = require('bcrypt');
const app = express()
const port = process.env.PORT || 5000
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// middlewares
app.use(cors())
app.use(express.json())


const users = [];
const posts = [];


async function run() {
    try {
        // User Registration using Email Password and username
        app.post('/register', async (req, res) => {
            try {
                const { email, password, username } = req.body;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const user = { email, password: hashedPassword, username };
                users.push(user);
                res.status(201).send('User created');
            } catch (error) {
                res.status(500).send(error.message);
            }
        });


        // User Login using username and password
        app.post('/login', async (req, res) => {
            try {
                const { username, password } = req.body;
                const user = users.find(u => u.username === username);
                if (!user) return res.status(400).send('Username or password is incorrect');

                const isPasswordMatch = await bcrypt.compare(password, user.password);
                if (!isPasswordMatch) return res.status(400).send('Username or password is incorrect');

                res.send('Login successful');
            } catch (error) {
                res.status(500).send(error.message);
            }
        });


    }
    finally {

    }
}

run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING!')
})

app.listen(port, () => {
    console.log(`Server is running on port---> ${port}`)
})