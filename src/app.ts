import express, { Request, Response } from "express";
import puppeteer from "puppeteer";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoint for Scraping
app.get(
  "/scrape",
  async (req: Request<{ query: { url: string } }>, res: any) => {
    const { url, verificationCode } = req.query;

    if (verificationCode == process.env.VERIFICATION_CODE) {
      return res.status(404).message("Something went wrong!");
    }

    if (!url || typeof url !== "string") {
      return res
        .status(400)
        .json({ error: "URL parameter is required and must be a string." });
    }

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "domcontentloaded" });

      const footerData = await page.evaluate(() => {
        const ogSiteName =
          document
            .querySelector('meta[property="og:title"]')
            ?.getAttribute("content") || "";
        const title = document.querySelector("title")?.innerText || "";

        const getAddress = () => {
          const addressElement = Array.from(
            document?.querySelectorAll("p") || []
          ).find((p) => p.textContent?.toLowerCase().includes("address"));
          return addressElement?.textContent?.trim() || "";
        };

        return {
          logo:
            document?.querySelector('link[rel="icon"]')?.getAttribute("href") ||
            "",
          companyName: ogSiteName || title || "",
          websiteUrl: window.location.href,
          facebookLink:
            document
              ?.querySelector("a[href*='facebook.com']")
              ?.getAttribute("href") || "",
          twitterLink:
            document
              ?.querySelector("a[href*='twitter.com']")
              ?.getAttribute("href") || "",
          linkedInUrl:
            document
              ?.querySelector("a[href*='linkedin.com']")
              ?.getAttribute("href") || "",
          youtubeLink:
            document
              ?.querySelector("a[href*='youtube.com']")
              ?.getAttribute("href") || "",
          instagramLink:
            document
              ?.querySelector("a[href*='instagram.com']")
              ?.getAttribute("href") || "",
          description:
            document
              .querySelector('meta[name="description"]')
              ?.getAttribute("content") || "",
          address: getAddress(),
          phoneNumber:
            document
              ?.querySelector("a[href^='tel:']")
              ?.getAttribute("href")
              ?.replace("tel:", "") || "",
          emailAddress:
            document
              ?.querySelector("a[href^='mailto:']")
              ?.getAttribute("href")
              ?.replace("mailto:", "") || "",
        };
      });

      await browser.close();

      res.json(footerData);
    } catch (error) {
      console.error("Error scraping the website:", error);
      res.status(500).json({ error: "Failed to scrape the website." });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
