import React, { useState, useMemo, useCallback, useEffect } from "react";
import { BarChart3, Filter, Search } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { Button, Backdrop, CircularProgress } from "@mui/material"; // ✅ Import from MUI
import stateStreetLogo from "../assets/logo.png";
import type { RowSelectionOptions } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise"; 
import { themeAlpine } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([AllEnterpriseModule]);

const rowSelection: RowSelectionOptions = {
  mode: "multiRow",
  headerCheckbox: true,
};

const DataGridDashboard: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [appliedTable, setAppliedTable] = useState<string>("");

  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);

  // ✅ Single loading state instead of two
  const [loading, setLoading] = useState(false);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agSetColumnFilter",
      floatingFilter: false,
      filterParams: { defaultToNothingSelected: true },
    };
  }, []);

  const onGridReady = useCallback((params: any) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  // Fetch all table names on load
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/tables");
        const json = await res.json();
        const tableNames = json.map((t: any) => t.tableName);
        setTables(tableNames);
      } catch (err) {
        console.error("Error fetching tables:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Fetch data for selected table
  const loadTableData = async () => {
    if (!selectedTable) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/table/${selectedTable}`);
      const rows = await res.json();

      if (rows.length > 0) {
        const cols = Object.keys(rows[0]).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
        }));
        setColumns(cols);
        setData(rows);
      } else {
        setColumns([]);
        setData([]);
      }
      setAppliedTable(selectedTable);
    } catch (err) {
      console.error("Error fetching table data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ MUI Backdrop Loader */}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* ---------------- HEADER ---------------- */}
      <div className="bg-white shadow-sm">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-600 px-6 py-1.5">
          <div className="h-14 flex items-center">
            <div className="text-white font-bold text-xl">
              <img
                src={stateStreetLogo}
                alt="State Street Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex-1 flex gap-6 px-3 pt-3 pb-6 overflow-hidden">
        {/* Data Grid Section */}
        <div className="flex-[0.8] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Data Grid
              {appliedTable && (
                <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {appliedTable}
                </span>
              )}
            </h2>
          </div>

          <div className="flex-1 p-0 overflow-hidden">
            {appliedTable && data.length > 0 ? (
              <div className="h-full w-full ag-theme-alpine">
                <AgGridReact
                  rowData={data}
                  columnDefs={columns}
                  defaultColDef={defaultColDef}
                  rowSelection={rowSelection}
                  theme={themeAlpine}
                  pagination={true}
                  paginationPageSize={10}
                  paginationPageSizeSelector={[10, 25, 50]}
                  sideBar={"filters"}
                  onGridReady={onGridReady}
                  animateRows={true}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No Data Selected</p>
                  <p className="text-sm">
                    Please select a table and click Submit to view data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex-[0.2] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filters
            </h2>
          </div>
          <div className="flex-1 p-4 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Table
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={loading}
              >
                <option value="">Choose a table...</option>
                {tables.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              fullWidth
              disabled={!selectedTable || loading}
              onClick={loadTableData}
              sx={{
                background: "#2563eb",
                color: "white",
                fontWeight: "400",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(to right, #3730a3, #1e40af)",
                },
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGridDashboard;
