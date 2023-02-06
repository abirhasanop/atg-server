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

        // Forget User password API
        app.post('/forgot-password', async (req, res) => {
            try {
                const { email } = req.body;
                const user = users.find(u => u.email === email);
                if (!user) return res.status(400).send('Email address not found');

                // Generate a token
                const token = crypto.randomBytes(20).toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                // Send reset password email
                const transporter = nodemailer.createTransport({
                    host: 'smtp.example.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'email@example.com',
                        pass: 'password'
                    }
                });

                const mailOptions = {
                    from: 'email@example.com',
                    to: email,
                    subject: 'Password Reset',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };

                await transporter.sendMail(mailOptions);
                res.send('Reset password email sent');
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