const { getDatabricksTables } = require('./databricksService');

(async () => {
  try {
    const tables = await getDatabricksTables();
    console.log("✅ Databricks Tables:");
    console.table(tables); // pretty print
  } catch (err) {
    console.error("❌ Error fetching tables:", err);
  }
})();
