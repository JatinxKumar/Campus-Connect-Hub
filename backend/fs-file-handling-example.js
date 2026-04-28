import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "example.txt");

async function createFile() {
  const initialContent = "Hello! This is the initial file content.\n";
  await fs.writeFile(filePath, initialContent, "utf8");
  console.log(`File created successfully: ${filePath}`);
}

async function readFile() {
  const content = await fs.readFile(filePath, "utf8");
  console.log("File read successfully. Content:");
  console.log(content);
}

async function updateFile() {
  const updatedContent = "Hello! The file content has been updated asynchronously.\n";
  await fs.writeFile(filePath, updatedContent, "utf8");
  console.log("File updated successfully.");
}

async function deleteFile() {
  await fs.unlink(filePath);
  console.log("File deleted successfully.");
}

async function runFileHandlingDemo() {
  try {
    await createFile();
    await readFile();

    await updateFile();
    await readFile();

    await deleteFile();
  } catch (error) {
    console.error("An error occurred during file operations:", error.message);
  }
}

runFileHandlingDemo();
