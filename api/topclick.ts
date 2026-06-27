export default async function handler(req, res) {
    try {
      const limit =
        typeof req.query.limit === "string" ? req.query.limit : "30";
  
      const url = new URL(
        "https://all.api.radio-browser.info/json/stations/topclick"
      );
  
      url.searchParams.append("limit", limit);
  
      const response = await fetch(url.toString());
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "topclick error" });
    }
  }
  