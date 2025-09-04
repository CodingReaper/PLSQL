import databricks.sql as dbsql
import pandas as pd
import numpy as np
import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connection details
server_hostname = os.getenv("DATABRICKS_HOST")
http_path = os.getenv("DATABRICKS_HTTP_PATH")
access_token = os.getenv("DATABRICKS_TOKEN")


# Custom JSON encoder to handle Pandas/Numpy objects
class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (pd.Timestamp, pd.Timedelta)):
            return obj.isoformat()  # or str(obj)
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        if isinstance(obj, (np.floating, np.float64)):
            return float(obj)
        if isinstance(obj, (np.ndarray,)):
            return obj.tolist()
        return super().default(obj)


# Function to get all tables in schema
def get_tables():
    with dbsql.connect(
        server_hostname=server_hostname,
        http_path=http_path,
        access_token=access_token
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES IN samples.bakehouse;")
            df = pd.DataFrame(cursor.fetchall(),
                              columns=[desc[0] for desc in cursor.description])
    return df.to_dict(orient="records")


# Function to get data from a specific table
def get_table_data(table_name):
    with dbsql.connect(
        server_hostname=server_hostname,
        http_path=http_path,
        access_token=access_token
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM samples.bakehouse.{table_name} LIMIT 300;")
            df = pd.DataFrame(cursor.fetchall(),
                              columns=[desc[0] for desc in cursor.description])

    # Convert datetime columns to string
    for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
        df[col] = df[col].astype(str)

    return df.to_dict(orient="records")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No mode specified"}, cls=CustomEncoder))
        sys.exit(1)

    mode = sys.argv[1]

    if mode == "tables":
        result = get_tables()
        print(json.dumps(result, cls=CustomEncoder))
    elif mode == "table":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Table name required"}, cls=CustomEncoder))
            sys.exit(1)
        table_name = sys.argv[2]
        result = get_table_data(table_name)
        print(json.dumps(result, cls=CustomEncoder))
    else:
        print(json.dumps({"error": "Invalid mode"}, cls=CustomEncoder))
