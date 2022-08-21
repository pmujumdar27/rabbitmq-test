const express = require('express');
const port = 5002;
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
        channel.consume("chatroom", data => {
            console.log(`Received data at 5002: ${Buffer.from(data.content)}`);
            channel.ack(data);
        })
    }
    catch (ex) {
        console.log("Error: ", ex.stack);
    }
}

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})