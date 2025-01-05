const backendUrl = "https://age-verify.onrender.com";

(async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, provider: "discord" }),
    });

    const { success, robloxRedirect } = await response.json();

    if (success) {
      window.location.href = robloxRedirect;
    } else {
      alert("Verification failed.");
    }
  }
})();
