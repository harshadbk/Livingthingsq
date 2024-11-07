const express = require('express');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://HARSHAD:HARSHAD@cluster0.yzv2blz.mongodb.net/e-commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Define message schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create message model
const Message = mongoose.model('Message', messageSchema);

// Define product schema
const productSchema = new mongoose.Schema({
    name: String
});

// Create product model
const Product = mongoose.model('Product', productSchema);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Search route
app.get('/search', async (req, res) => {
    const query = req.query.query;

    try {
        const results = await Product.find({ name: { $regex: query, $options: 'i' } });

        if (results.length > 0) {
            let output = '';
            results.forEach((row) => {
                output += `Product Name: ${row.name}<br>`;
            });
            res.send(output);
        } else {
            res.send('No products found.');
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Database query failed.');
    }
});

// Create Socket.IO server
const io = new Server(3000, {
    cors: {
        origin: "*",
    }
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        console.log(`${name} has joined the chat.`);
        socket.broadcast.emit('user-joined', name);

        // Send previous messages to the new user
        Message.find().then(messages => {
            socket.emit('previous-messages', messages);
        }).catch(err => {
            console.error("Error fetching previous messages:", err);
        });
    });

    socket.on('send', (message) => {
        const userName = users[socket.id];
        if (userName) {
            console.log("Message sent from:", userName, "Message:", message);
            const newMessage = new Message({ name: userName, message });

            newMessage.save()
                .then(() => {
                    socket.broadcast.emit('receive', { message: message, name: userName });
                })
                .catch(err => {
                    console.error("Error saving message:", err);
                });
        } else {
            console.warn("User not found for socket ID:", socket.id);
        }
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            console.log(`${name} has left the chat.`);
            socket.broadcast.emit('left', name);
            delete users[socket.id];
        }
    });
});

// Start the Express server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
