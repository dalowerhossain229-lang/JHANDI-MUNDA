const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - গেটওয়ে সকেট প্রোটোকল লক ভাই ভাই]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

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

// 🎲 ঝান্ডি মুন্ডার ৬টি ওরিজিনাল ট্রাডিশনাল প্রতীক পুল
const jhandiSymbolsPool = ["FLAG", "CROWN", "SPADE", "HEART", "DIAMOND", "CLUB"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারсеপ্টর গেটওয়ে
app.get('/api/jhandi-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: 0, wallet: targetWallet, game: "jhandimunda"
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ঝান্ডি মুন্ডা কোর ট্রানজেকশন ডিল রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/jhandi-deal', async (req, res) => {
    const { userId, amount, wallet, prediction, game } = req.body;
    
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = prediction || "FLAG"; // FLAG, CROWN, SPADE, HEART, DIAMOND, CLUB
    const finalGameName = "jhandimunda"; // 🎯 লবির কি-শর্টকোড টাইট লক

    // 🔒 ফিল্টার বাউন্সার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 20000 || !jhandiSymbolsPool.includes(userPrediction)) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter (৳১ - ৳Subcontinent)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার সাথে সাথে ডাটাবেজ থেকে BDT টাকা এবং ওরিজিনাল গেমের নাম কেটে নেওয়ার বর্ম লক
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet", username: userId, amount: reqAmount, wallet: targetWallet, game: finalGameName
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "X Database Sync Error! Please refresh and try again." });
        }

        if (currentDbBalance < 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "X Insufficient Balance! Please Recharge." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.jhandi_target) ? balResponse.data.jhandi_target : null;

        let diceResult = [];
        let matchCount = 0;
        let winMultiplier = 0.00;
        let finalStatus = "lose";
        
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ক্যাসিনো RTP এবং ৬-ডাইস র্যান্ডমাইজেশন সেটেলমেন্ট লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            diceResult = [];
            matchCount = 0;

            // ৬টি আলাদা ডাইস বা ছক্কার মুখ জেনারেট করার কোর লুপ
            for (let d = 0; d < 6; d++) {
                let randomSymbol = jhandiSymbolsPool[Math.floor(Math.random() * jhandiSymbolsPool.length)];
                diceResult.push(randomSymbol);
                if (randomSymbol === userPrediction) {
                    matchCount++;
                }
            }

            // ঝান্ডি মুন্ডা ওরিজিনাল ওッズ টেবিল সিঙ্ক: যত ঘর মিলবে তত গুণ ওডস লাফাবে ভাই ভাই!
            if (matchCount > 0) {
                finalStatus = "win";
                // ১ বার মিললে ১ গুণ ফেরত (আসল সহ ২), ২ বার মিললে ডাবল, এভাবে ডাইনামিক সিঙ্ক লক ওস্তাদ
                winMultiplier = matchCount + 1; 
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন প্যানেল কন্ট্রোল ট্রিগার চাবি
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "win") isLoopActive = false;
                if (adminTriggeredPrize === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৪৫% এ ব্যালেন্সড লক ভাই ভাই!
                    if (matchCount >= 3) {
                        // ৩ ঘর বা তার বেশি মেগা ম্যাচ সহজে হতে না দিয়ে আরটিপি ক্যাশ চেইন ধরে রাখার মেগা ট্রিক ওস্তাদ!
                        if (Math.random() <= 0.15) isLoopActive = false; 
                    } else {
                        if (Math.random() <= 0.45) isLoopActive = false;
                    }
                } else {
                    isLoopActive = false;
                }
            }
        }

        let winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount; // 🔒 বাজি হারলেও ডাটাবেজে আপনার রিয়াল বাজি ধরার টাকাই (Stake) জমা হবে ওস্তাদ!

        if (finalStatus === "win") {
            winAmount = Math.round(reqAmount * winMultiplier);
            dbAction = "win";
            dbAmount = parseFloat(winAmount); // জিতলে উইনিং এমাউন্ট যাবে
        }

        let phpPayload = {
            action: dbAction, username: userId, amount: dbAmount, wallet: targetWallet, game: finalGameName
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = winMultiplier.toFixed(2);
            phpPayload.status = "win";
        } else {
            phpPayload.bet_amount = reqAmount;
            phpPayload.status = "lose";
        }

        // 🛫 ৩. মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-টাইম উইন-লস সেটেলমেন্ট এপিআই হিট
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                gameData: {
                    diceResult: diceResult,
                    matchCount: matchCount,
                    status: finalStatus,
                    winAmount: winAmount,
                    resultSymbol: userPrediction
                }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined by Database!" });
        }

    } catch (e) {
        console.error("Jhandi Munda Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click DEAL again." });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Player connected to Jhandi Munda Engine Live Node!");
});

// ⚡ কাস্টম ঝান্ডি মুন্ডা নোড সার্ভার পোর্ট গেটওয়ে লাইভ অন ফায়ার
const PORT = process.env.PORT || 30000;
server.listen(PORT, () => {
    console.log(`🎡 Jhandi Munda Engine Running on port ${PORT}`);
});
