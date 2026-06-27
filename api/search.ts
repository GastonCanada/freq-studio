export default async function handler(req, res) {
    try {
      const queryParams: Record<string, string> = {};
  
      for (const [key, val] of Object.entries(req.query)) {
        if (typeof val === "string") {
          queryParams[key] = val;
        }
      }
  
      // defaults
      if (!queryParams.limit) queryParams.limit = "50";
      if (!queryParams.hidebroken) queryParams.hidebroken = "true";
  
      // Venezuela fix
      if (
        queryParams.country &&
        (queryParams.country.toLowerCase() === "venezuela" ||
          queryParams.country.toLowerCase().includes("venezuela"))
      ) {
        delete queryParams.country;
        queryParams.countrycode = "VE";
      }
  
      const url = new URL(
        "https://all.api.radio-browser.info/json/stations/search"
      );
  
      Object.entries(queryParams).forEach(([k, v]) => {
        url.searchParams.append(k, v);
      });
  
      const response = await fetch(url.toString());
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }