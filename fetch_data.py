import databricks.sql as dbsql
import pandas as pd
import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

server_hostname = os.getenv("DATABRICKS_HOST")
http_path = os.getenv("DATABRICKS_HTTP_PATH")
access_token = os.getenv("DATABRICKS_TOKEN")

def get_tables():
    with dbsql.connect(server_hostname=server_hostname,
                       http_path=http_path,
                       access_token=access_token) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES IN samples.bakehouse;")
            df = pd.DataFrame(cursor.fetchall(),
                              columns=[desc[0] for desc in cursor.description])
    return df.to_dict(orient="records")

def get_table_data(table_name):
    with dbsql.connect(server_hostname=server_hostname,
                       http_path=http_path,
                       access_token=access_token) as connection:
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM samples.bakehouse.{table_name};")
            df = pd.DataFrame(cursor.fetchall(),
                              columns=[desc[0] for desc in cursor.description])
    return df.to_dict(orient="records")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No mode specified"}))
        sys.exit(1)

    mode = sys.argv[1]

    if mode == "tables":
        result = get_tables()
        print(json.dumps(result))
    elif mode == "table":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Table name required"}))
            sys.exit(1)
        table_name = sys.argv[2]
        result = get_table_data(table_name)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "Invalid mode"}))
