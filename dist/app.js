var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import puppeteer from "puppeteer";
const app = express();
const PORT = 3000;
app.use(express.json());
// API Endpoint for Scraping
app.get("/scrape", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
        return res
            .status(400)
            .json({ error: "URL parameter is required and must be a string." });
    }
    try {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        yield page.goto(url, { waitUntil: "domcontentloaded" });
        const footerData = yield page.evaluate(() => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const ogSiteName = ((_a = document
                .querySelector('meta[property="og:title"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
            const title = ((_b = document.querySelector("title")) === null || _b === void 0 ? void 0 : _b.innerText) || "";
            const getAddress = () => {
                var _a;
                const addressElement = Array.from((document === null || document === void 0 ? void 0 : document.querySelectorAll("p")) || []).find((p) => { var _a; return (_a = p.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("address"); });
                return ((_a = addressElement === null || addressElement === void 0 ? void 0 : addressElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
            };
            return {
                logo: ((_c = document === null || document === void 0 ? void 0 : document.querySelector('link[rel="icon"]')) === null || _c === void 0 ? void 0 : _c.getAttribute("href")) ||
                    "",
                companyName: ogSiteName || title || "",
                websiteUrl: window.location.href,
                facebookLink: ((_d = document === null || document === void 0 ? void 0 : document.querySelector("a[href*='facebook.com']")) === null || _d === void 0 ? void 0 : _d.getAttribute("href")) || "",
                twitterLink: ((_e = document === null || document === void 0 ? void 0 : document.querySelector("a[href*='twitter.com']")) === null || _e === void 0 ? void 0 : _e.getAttribute("href")) || "",
                linkedInUrl: ((_f = document === null || document === void 0 ? void 0 : document.querySelector("a[href*='linkedin.com']")) === null || _f === void 0 ? void 0 : _f.getAttribute("href")) || "",
                youtubeLink: ((_g = document === null || document === void 0 ? void 0 : document.querySelector("a[href*='youtube.com']")) === null || _g === void 0 ? void 0 : _g.getAttribute("href")) || "",
                instagramLink: ((_h = document === null || document === void 0 ? void 0 : document.querySelector("a[href*='instagram.com']")) === null || _h === void 0 ? void 0 : _h.getAttribute("href")) || "",
                description: ((_j = document
                    .querySelector('meta[name="description"]')) === null || _j === void 0 ? void 0 : _j.getAttribute("content")) || "",
                address: getAddress(),
                phoneNumber: ((_l = (_k = document === null || document === void 0 ? void 0 : document.querySelector("a[href^='tel:']")) === null || _k === void 0 ? void 0 : _k.getAttribute("href")) === null || _l === void 0 ? void 0 : _l.replace("tel:", "")) || "",
                emailAddress: ((_o = (_m = document === null || document === void 0 ? void 0 : document.querySelector("a[href^='mailto:']")) === null || _m === void 0 ? void 0 : _m.getAttribute("href")) === null || _o === void 0 ? void 0 : _o.replace("mailto:", "")) || "",
            };
        });
        yield browser.close();
        res.json(footerData);
    }
    catch (error) {
        console.error("Error scraping the website:", error);
        res.status(500).json({ error: "Failed to scrape the website." });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
