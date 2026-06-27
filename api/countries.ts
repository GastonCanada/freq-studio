export default async function handler(req, res) {
    try {
      const url = new URL(
        "https://all.api.radio-browser.info/json/countries"
      );
  
      const response = await fetch(url.toString());
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (err) {
      console.error("countries error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }