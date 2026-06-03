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

// 🎲 [মেগা ইমেজ সিঙ্ক লক]: ওস্তাদের গিটহাবের ওরিজিনাল ছবির বানানের সাথে ১ মিলিমিটার নিখুঁত সিঙ্ক করা ইন্টারন্যাশনাল ছক্কার পুল
const jhandiSymbolsPool = ["CLUB", "CROWN", "DIAMOND", "FLAG", "HEART", "SPADE"];

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স ইন্টারсеপ্টর গেটওয়ে (১ শতভাগ টাইমআউট ও জ্যাম ব্লকার বর্ম ওস্তাদ)
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
        console.log("Jhandi-Munda Balance Stream Reconnected.");
        return res.json({ success: false, balance: 0 }); 
    }
});

// 🛫 ২. ঝান্ডি মুন্ডা কোর ট্রানজেকশন রোল রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/jhandi-roll', async (req, res) => {
    const { userId, amount, wallet, prediction } = req.body; 
    const reqAmount = parseFloat(amount) || 50;
    const userPrediction = String(prediction).toUpperCase(); // CLUB, CROWN, DIAMOND, FLAG, HEART, SPADE
    const finalGameName = "jhandimunda"; 
    const targetWallet = wallet || "main";

    if (reqAmount < 1 || reqAmount > 20000 || !jhandiSymbolsPool.includes(userPrediction)) {
        return res.json({ success: false, message: "🚨 Invalid Bet Parameter!" });
    }

    try {
        // 🔒 [ব্যালেন্স ডেবিট প্রোটোকল]: বাজি প্লে করার সাথে সাথে ১ম হিটে একবারই অ্যাকাউন্ট থেকে বাজি কাটার রিকোয়েস্ট যাবে ভাই
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
                let randomSymbol = jhandiSymbolsPool[Math.floor(Math.random() * 6)];
                rolledDiceResults.push(randomSymbol);
                if (randomSymbol === userPrediction) {
                    matchCount++;
                }
            }

            if (matchCount >= 1) {
                finalStatus = "win";
                winMultiplier = matchCount + 1; // ঝান্ডি মুন্ডা অফিশিয়াল রুলস লক
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            // এডমিন প্যানেল ফোর্স ওভাররাইড কন্ট্রোল নব ফিল্টারিং চ্যাম (লবির ওল্ড বাংলা নামের মেপিং নব লক ভাই ভাই)
            let dbTargetMapping = (balResponse.data && balResponse.data.jhandi_target) ? String(balResponse.data.jhandi_target).toUpperCase() : null;
            // ওল্ড ড্যাশবোর্ডের কন্ডিশনাল কনভার্টার
            if (dbTargetMapping === "CHIRITAN") dbTargetMapping = "CLUB";
            if (dbTargetMapping === "ITTA") dbTargetMapping = "DIAMOND";
            if (dbTargetMapping === "PAAN") dbTargetMapping = "HEART";
            if (dbTargetMapping === "ISKABON") dbTargetMapping = "SPADE";
            if (dbTargetMapping === "JHANDI") dbTargetMapping = "FLAG";

            if (dbTargetMapping) {
                if (dbTargetMapping === "FORCE_LOSE" && finalStatus === "win") isLoopActive = false;
                if (dbTargetMapping === userPrediction && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    if (Math.random() <= 0.43) isLoopActive = false; // সুপ্রিম আরটিপি ৪৩% লক
                } else {
                    isLoopActive = false;
                }
            }
        }

        // 🎯 [মেগা কিলার জিরো-ডাবল-ডেবিট স্টেক ব্যালেন্সার বর্ম ভাই ভাই]
        let winAmount = 0;
        let dbAction = "win"; 
        let dbAmount = 0;

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

        // 🛫 ৩. মেইন সাইটের সিকিউরড গেটওয়েতে রিয়েল-টাইম উইন-লস সেটেলমেন্ট এপিআই হিট
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, phpPayload, { timeout: 45000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });
            
            return res.json({
                success: true,
                data: { balance: response.data.balance },
                gameData: { rolledDiceResults, matchCount, status: finalStatus, winAmount }
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "X Bet Settlement Declined!" });
        }
    } catch (e) { 
        console.error("Jhandi Munda Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click ROLL again." }); 
    }
});

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname, 'index.html')); });
io.on('connection', (socket) => {});

const PORT = process.env.PORT || 30000;
server.listen(PORT, () => { console.log(`🎡 Jhandi Munda Engine Running on port ${PORT}`); });
