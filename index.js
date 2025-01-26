const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const index = express();

const url = "https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap";

index.get("/", async (req, res) => {
  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const h1S = [];
      const links = [];
      const imgs = [];
      const pageTitle = $("title").text();

      $("h1").each((_, element) => {
        const h1 = $(element).text();
        h1S.push(h1);
      });
      $("img").each((_, element) => {
        const img = $(element).attr("src");
        imgs.push(img);
      });

      $("a").each((_, element) => {
        const link = $(element).attr("href");
        links.push(link);
      });

      res.send(`
        <h1>${pageTitle}</h1>
        <h2>H1 Tags</h2>
        <ul>
          ${h1S.map((h1) => `<li>${h1}</li>`).join("")}
        </ul>
        <h2>Links</h2>
        <ul>
          ${links
            .map(
              (link) => `<li><a href="${link}" target="_blank">${link}</a></li>`
            )
            .join("")}
        </ul>
        <h2>Images</h2>
        <ul>
          ${imgs
            .map(
              (img) => `<li><a href="${img}" target="_blank">${img}</a></li>`
            )
            .join("")}
        </ul>
      `);
    } else {
      res.status(500).send("Error: Failed to fetch the page");
    }
  } catch (error) {
    console.error("Error fetching the URL:", error.message);
    res.status(500).send("Error: Unable to fetch the page");
  }
});

index.listen(3000, () => {
  console.log(
    "express esta escuchando en el puerto local http://localhost:3000"
  );
});
