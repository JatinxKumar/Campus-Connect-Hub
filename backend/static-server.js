import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

// Serve all files inside /public directly at the site root.
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
