const express = require('express');
const app = express();
const Net = require('net');
const port = 3000;

app.use(express.static('public'));

const currencyPairs = ['EURUSD', 'GBPUSD', 'USDCHF', 'USDJPY', 'AUDUSD', 'NZDUSD', 'USDCAD'];
let forexData = {};

currencyPairs.forEach(symbol => {
    forexData[symbol] = { ask: 'Loading...', bid: 'Loading...' };
});

function getQuoteFromServer(symbol) {
    const client_cmd = new Net.Socket();

    client_cmd.connect(77, 'localhost', function () {
        const JSONobj = {};
        JSONobj['MSG'] = 'QUOTE';
        JSONobj['SYMBOL'] = symbol;
        client_cmd.write(JSON.stringify(JSONobj) + '\r\n');
    });

    client_cmd.on('data', function (chunk) {
        try {
            const JSONresult = JSON.parse(chunk.toString());
            forexData[symbol].ask = JSONresult['ASK'];
            forexData[symbol].bid = JSONresult['BID'];
        } catch (error) {
            console.error(`Error parsing data for ${symbol}:`, error);
            forexData[symbol].ask = 'Error';
            forexData[symbol].bid = 'Error';
        }
        client_cmd.end();
    });

    client_cmd.on('error', (err) => {
        console.error(`Error connecting to server for ${symbol}:`, err);
        forexData[symbol].ask = 'Error';
        forexData[symbol].bid = 'Error';
    });
}

function updateQuotes() {
    currencyPairs.forEach(symbol => {
        getQuoteFromServer(symbol);
    });
}

updateQuotes(); // Get initial prices
setInterval(updateQuotes, 5000);

// WebSocket Server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    ws.send(JSON.stringify(forexData));

    setInterval(() => {
        ws.send(JSON.stringify(forexData));
    }, 5000);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});