require('dotenv').config();
const express = require('express');
const cors = require('cors'); // CORS paketini dahil et
const fetch = require('node-fetch');
const app = express();

// CORS yapılandırması
app.use(cors({
  origin: "https://z-eso0111.github.io", // Frontend URL'si
  methods: ["GET", "POST"], // İzin verilen HTTP metotları
}));

app.use(express.json());

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const ROBLOX_REDIRECT = "https://authorize.roblox.com/?client_id=" + process.env.ROBLOX_CLIENT_ID + "&response_type=code&redirect_uri=https%3A%2F%2Fz-eso0111.github.io%2Fage_Verify%2Fcallback.html&scope=openid+profile";
const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;

app.post('/verify', async (req, res) => {
  const { code, provider } = req.body;

  try {
    if (provider === 'discord') {
      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: "https://z-eso0111.github.io/age_Verify/callback.html",
        }),
      });

      const tokenData = await tokenResponse.json();
      const userId = tokenData.user.id;

      return res.json({ success: true, robloxRedirect: ROBLOX_REDIRECT, userId });
    } else if (provider === 'roblox') {
      const userAge = 17; // Yaşı kontrol et
      if (userAge >= 16) {
        await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}/roles/${ROLE_ID}`, {
          method: "PUT",
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });
        return res.json({ success: true });
      } else {
        return res.status(400).json({ success: false, error: "Age restriction." });
      }
    }
  } catch (error) {
    console.error("Error in verification:", error);
    return res.status(500).json({ success: false });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
