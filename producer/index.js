const express = require('express');
const port = 5001;
const amqp = require('amqplib');
const bp = require('body-parser');
var channel, connection;

const app = express();
app.use(bp.json());

connect();
async function connect() {
    try {
        const amqpServer = 'amqp://localhost:5672';
        connection = await amqp.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("chatroom");
        console.log("Channel created!");
    }
    catch (ex) {
        console.log("Error: ", ex.stack);
    }
}

app.get('/send', async (req, res) => {
    const sampleData = {
        name: "Pushkar Mujumdar",
        age: "21"
    }

    await channel.sendToQueue("chatroom", Buffer.from(JSON.stringify(sampleData)));

    res.json({
        message: "Data sent to RabbitMQ!",
        data: sampleData
    })
})

app.get('/close', async (req, res) => {
    await channel.close();
    await connection.close();

    res.json({
        message: "Channel and connection closed!"
    })
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})