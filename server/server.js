app.post('/verify', async (req, res) => {
  const { code, provider } = req.body; // Gelen doğrulama kodu ve hangi platformdan geldiği

  try {
    let tokenResponse;
    if (provider === 'discord') {
      tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
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
    } else if (provider === 'roblox') {
      tokenResponse = await fetch("https://apis.roblox.com/v1/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.ROBLOX_CLIENT_ID,
          client_secret: process.env.ROBLOX_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: "https://z-eso0111.github.io/age_Verify/callback.html",
        }),
      });
    }

    const tokenData = await tokenResponse.json();
    return res.json({ success: true, data: tokenData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Verification failed." });
  }
});
