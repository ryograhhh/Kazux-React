const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
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
