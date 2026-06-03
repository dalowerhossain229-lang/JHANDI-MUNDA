const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গ্লোবাল গেটওয়ে সকেট প্রোটোকল লক ভাই ভাই]
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক ভাই ভাই]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 🎲 झान्डी मुन्डा ওরিজিনাল ৬টি ঐতিহ্যবাহী ক্যাসিনো প্রতীকের ইউনিভার্সাল ব্যাকএন্ড পুল লক ভাই ভাই
const jhandiSymbolsPool = ["JHANDI", "MUNDA", "ITTA", "PAAN", "CHIRITAN", "ISKABON", "FLAG", "CROWN", "DIAMOND", "HEART", "CLUB", "SPADE"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারসেপ্টর গেটওয়ে (১ শতভাগ টাইমআউট ও জ্যাম ব্লকার বর্ম ওস্তাদ)
app.get('/api/jhandi-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "balance", 
            username: userId,
            amount: 0,
            wallet: targetWallet,
            game: "jhandimunda"
        }, { timeout: 15000 });

        if (response.data && (response.data.status === "ok" || response.data.success === true)) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { 
        return res.json({ success: false, balance: 0 }); 
    }
});

// 🛫 ২. ঝান্ডি মুন্ডা কোর ট্রানজেকশন রোল রাউট (POST Route - ১০০% প্যারামিটার এরর ব্লকার নিয়ন বর্ম ওস্তাদ!)
app.post('/api/jhandi-roll', async (req, res) => {
    const { userId, amount, wallet, prediction } = req.body;
    const reqAmount = parseFloat(amount) || 50;
    
    // 🎯 [মেগা টাইপো বাউন্সার]: ফ্রন্টএন্ড থেকে ছোট-বড় বা কাস্টম বানানে প্রতীক আসলেও তাকে ইউনিভার্সাল আপারকেসে কনভার্ট চ্যাম
    let userPrediction = String(prediction || "FLAG").toUpperCase();
    const finalGameName = "jhandimunda"; 
    const targetWallet = wallet || "main";

    // 🔒 [ফ্রন্টএন্ড টু ব্যাকএন্ড রিয়েল-টাইম হার্ডকোড ট্রান্সলেটর বর্ম ভাই ভাই]
    if (userPrediction === "FLAG") userPrediction = "JHANDI";
    if (userPrediction === "CROWN") userPrediction = "MUNDA";
    if (userPrediction === "DIAMOND") userPrediction = "ITTA";
    if (userPrediction === "HEART") userPrediction = "PAAN";
    if (userPrediction === "CLUB") userPrediction = "CHIRITAN";
    if (userPrediction === "SPADE") userPrediction = "ISKABON";

    const baseSymbolsPool = ["JHANDI", "MUNDA", "ITTA", "PAAN", "CHIRITAN", "ISKABON"];

    if (reqAmount < 1 || reqAmount > 20000 || !baseSymbolsPool.includes(userPrediction)) {
        console.log("Rejected Prediction Token Check:", userPrediction);
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter!" });
    }

    try {
        // 🔒 [ব্যালেন্স ডেবিট প্রোটোকল]: বাজি প্লে করার সাথে সাথে ১ম হিটে একবারই অ্যাকাউন্ট থেকে বাজি কাটার রিকোয়েস্ট যাবে ভাই ভাই
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: reqAmount, wallet: targetWallet, game: finalGameName
        }, { timeout: 30000 });
        
        if (!balResponse.data || balResponse.data.status !== "ok") {
            return res.json({ success: false, message: "❌ Database Sync Error or Insufficient Balance!" });
        }

        let currentDbBalance = parseFloat(balResponse.data.balance);
        let rolledDiceResults = [];
        let matchCount = 0;
        let winMultiplier = 0.00;
        let finalStatus = "lose";

        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP এবং ৬-ডাইস ঝান্ডি মুন্ডা রোল লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 150) {
            loopSafety++;
            rolledDiceResults = [];
            matchCount = 0;

            for (let i = 0; i < 6; i++) {
                let randomSymbol = baseSymbolsPool[Math.floor(Math.random() * 6)];
                rolledDiceResults.push(randomSymbol);
                if (randomSymbol === userPrediction) {
                    matchCount++;
                }
            }

            if (matchCount >= 1) {
                finalStatus = "win";
                winMultiplier = matchCount + 1; 
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // एडमीन প্যানেল ফোর্স ওভাররাইড কন্ট্রোল নব ফিল্টারিং চ্যাম
            if (balResponse.data && balResponse.data.jhandi_target) {
                let target = String(balResponse.data.jhandi_target).toUpperCase();
                if (target === "FLAG") target = "JHANDI";
                if (target === "CROWN") target = "MUNDA";
                if (target === "DIAMOND") target = "ITTA";
                if (target === "HEART") target = "PAAN";
                if (target === "CLUB") target = "CHIRITAN";
                if (target === "SPADE") target = "ISKABON";

                if (target === "FORCE_LOSE" && finalStatus === "win") isLoopActive = false;
                if (target === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    if (Math.random() <= 0.43) isLoopActive = false;
                } else {
                    isLoopActive = false;
                }
            }
        }

        // 🎯 [মেগা কিলার জিরো-ডাবল-ডেবিট স্টেক ব্যালেন্সার বর্ম ভাই ভাই - অন্দর বাহার সিঙ্ক]
        let winAmount = 0, dbAction = "win", dbAmount = 0;

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win"; dbAmount = parseFloat(winAmount); 
        } else {
            dbAction = "win"; dbAmount = 0; 
        }

        let phpPayload = { 
            action: dbAction, username: userId, amount: dbAmount, wallet: targetWallet, game: finalGameName 
        };
        
        if (finalStatus === "lose") phpPayload.status = "lose";
        else phpPayload.status = "win";

        phpPayload.bet_amount = reqAmount;

        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 45000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({
                success: true,
                balance: response.data.balance,
                data: { balance: response.data.balance },
                gameData: { rolledDiceResults, matchCount, status: finalStatus, winAmount }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined by Database!" });
        }
    } catch (e) { 
        return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." }); 
    }
});

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, 'index.html')); });
io.on('connection', (socket) => {});

const PORT = process.env.PORT || 20000;
server.listen(PORT, () => { console.log(`🎡 Jhandi Munda Engine Running on port ${PORT}`); });
