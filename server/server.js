require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const ROBLOX_REDIRECT = "https://authorize.roblox.com/?client_id=1816916132328990554&response_type=code&redirect_uri=https%3A%2F%2Fz-eso0111.github.io%2Fage_Verify%2Fcallback.html&scope=openid+profile";

app.post('/verify-discord', async (req, res) => {
  const { code } = req.body;

  try {
    const discordResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://z-eso0111.github.io/age_Verify/callback.html",
      }),
    });

    const discordData = await discordResponse.json();
    if (discordData.error) {
      return res.status(400).json({ success: false, error: discordData.error });
    }

    const userId = discordData.user?.id;

    if (userId) {
      return res.status(200).json({ success: true, robloxRedirect: ROBLOX_REDIRECT });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying Discord:", error);
    return res.status(500).json({ success: false });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));