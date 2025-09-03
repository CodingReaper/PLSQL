import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PYTHON_PATH = path.join(__dirname, "../../fetch_data.py");

function runPython(args = []) {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [PYTHON_PATH, ...args]);
    let data = "";

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python exited with code ${code}`));
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

// Export functions
export const getTables = () => runPython(["tables"]);
export const getTableData = (tableName) => runPython(["table", tableName]);
