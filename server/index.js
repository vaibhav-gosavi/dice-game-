const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const Web3 = require('web3');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory balance storage (temporary, replace with database for production)
let playerBalance = 1000;

// Web3 setup (Simulating a crypto wallet balance without blockchain connection)
const web3 = new Web3(); // No real blockchain connection
let playerWallet = {
    address: null,
    balance: 0, // Crypto balance (Simulated for now)
};

// Function to generate a provably fair hash
const generateHash = (serverSeed) => {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
};

app.get('/', (req, res) => {
    res.send('Provably Fair Dice API');
});

// API endpoint for rolling the dice
app.post('/roll-dice', (req, res) => {
    const { betAmount, clientSeed } = req.body;
    
    if (betAmount > playerBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Generate server seed and hash it
    const serverSeed = crypto.randomBytes(16).toString('hex');
    const serverHash = generateHash(serverSeed);
    
    // Combine server and client seeds to generate a fair roll
    const combinedSeed = serverSeed + clientSeed;
    const rollValue = parseInt(crypto.createHash('sha256').update(combinedSeed).digest('hex').substring(0, 2), 16) % 6 + 1;
    
    let result = 'lose';
    if (rollValue >= 4) {
        playerBalance += betAmount; // Player wins 2x payout
        result = 'win';
    } else {
        playerBalance -= betAmount; // Player loses bet amount
    }
    
    res.json({
        roll: rollValue,
        result,
        newBalance: playerBalance,
        serverSeed,
        serverHash,
    });
});

// API to get current balance
app.get('/balance', (req, res) => {
    res.json({ balance: playerBalance });
});

// API to connect wallet (Simulated for now)
app.post('/connect-wallet', async (req, res) => {
    const { address } = req.body;

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    playerWallet.address = address;
    playerWallet.balance = Math.floor(Math.random() * 5) + 1; // Simulated balance

    res.json({ message: "Connected successfully" });
});

// API to get wallet balance
app.get('/wallet-balance', (req, res) => {
    res.json({ walletAddress: playerWallet.address, cryptoBalance: playerWallet.balance });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
