const discordClientId = "1324856160469258294";
const discordRedirectUri = "https://z-eso0111.github.io/age_Verify/callback.html";
const robloxRedirectUri = "https://authorize.roblox.com/?client_id=1816916132328990554&response_type=code&redirect_uri=https%3A%2F%2Fz-eso0111.github.io%2Fage_Verify%2Fcallback.html&scope=openid+profile";

(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    const discordResponse = await fetch("http://localhost:3000/verify-discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const { success, robloxRedirect } = await discordResponse.json();

    if (success) {
      window.location.href = robloxRedirect;
    } else {
      alert("Discord verification failed.");
    }
  }
})();