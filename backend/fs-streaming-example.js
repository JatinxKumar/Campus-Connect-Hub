import fs from "fs";
import path from "path";
import { promises as fsp } from "fs";

const filePath = path.join(process.cwd(), "large-file.txt");

async function ensureLargeFile() {
  try {
    await fsp.access(filePath);
    console.log(`Using existing file: ${filePath}`);
  } catch {
    console.log("Large file not found. Creating one for the demo...");

    // Build a reasonably large file (~5 MB) for stream reading demonstration.
    const line = "Node.js streaming example line for large file handling.\n";
    const targetSizeBytes = 5 * 1024 * 1024;
    const iterations = Math.ceil(targetSizeBytes / Buffer.byteLength(line));

    const writer = fs.createWriteStream(filePath, { encoding: "utf8" });

    for (let i = 0; i < iterations; i += 1) {
      const canContinue = writer.write(line);
      if (!canContinue) {
        await new Promise((resolve) => writer.once("drain", resolve));
      }
    }

    await new Promise((resolve, reject) => {
      writer.end(() => resolve());
      writer.on("error", reject);
    });

    console.log(`Created large file: ${filePath}`);
  }
}

async function streamLargeFile() {
  await ensureLargeFile();

  const readableStream = fs.createReadStream(filePath, {
    encoding: "utf8",
    highWaterMark: 64 * 1024,
  });

  let chunkCount = 0;
  let totalBytes = 0;

  readableStream.on("data", (chunk) => {
    chunkCount += 1;
    totalBytes += Buffer.byteLength(chunk, "utf8");

    console.log(`\nChunk #${chunkCount} (${Buffer.byteLength(chunk, "utf8")} bytes):`);
    console.log(chunk.slice(0, 200));
  });

  readableStream.on("end", () => {
    console.log(`\nStreaming finished. Read ${totalBytes} bytes in ${chunkCount} chunks.`);
  });

  readableStream.on("error", (error) => {
    console.error("Error while streaming file:", error.message);
  });
}

streamLargeFile();
