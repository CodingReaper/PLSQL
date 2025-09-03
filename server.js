import express from "express";
import cors from "cors";
import { getTables, getTableData } from "./src/services/databricksService.js";

const app = express();
app.use(cors());
app.use(express.json());

// Get list of tables
app.get("/tables", async (req, res) => {
  try {
    const tables = await getTables();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get table data
app.get("/table/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const rows = await getTableData(name);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
