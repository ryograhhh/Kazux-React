const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/get_profile", async (req, res) => {
  try {
    const { cookie } = req.body;
    
    const userIdMatch = cookie.match(/c_user=(\d+)/);
    if (!userIdMatch) {
      return res.json({ success: false, error: "Invalid cookie format" });
    }
    
    const userId = userIdMatch[1];
    
    const profileUrl = `https://graph.facebook.com/${userId}?fields=name,picture.type(large)&access_token=${userId}|placeholder`;
    
    try {
      const response = await axios.get(profileUrl);
      res.json({
        success: true,
        name: response.data.name,
        avatar: response.data.picture?.data?.url || `https://graph.facebook.com/${userId}/picture?type=large`
      });
    } catch (error) {
      res.json({
        success: true,
        name: userId,
        avatar: `https://graph.facebook.com/${userId}/picture?type=large`
      });
    }
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post("/api/get_reactions", async (req, res) => {
  try {
    const { session, link: post_link, reaction_type } = req.body;

    const response = await axios.post(
      "https://api.lara.rest/external-api/get_reactions",
      { session, link: post_link, reaction_type },
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error in proxy:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`KazuX running at http://localhost:${PORT}`);
});
