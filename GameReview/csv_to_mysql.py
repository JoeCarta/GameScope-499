import csv
import mysql.connector
import re


# ==========================================
# Ask for Steam App ID
# ==========================================

app_id = input("Enter Steam App ID: ").strip()

input_file = f"steam_reviews_filtered_{app_id}.csv"


# ==========================================
# Connect to MySQL
# ==========================================

db = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="NewPassword123!",
    database="game_reviews"
)

cursor = db.cursor()


# ==========================================
# Read CSV
# ==========================================

try:
    with open(input_file, "r", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)
        rows = list(reader)

except FileNotFoundError:
    print(f"Error: Could not find {input_file}")
    cursor.close()
    db.close()
    exit()


if not rows:
    print("Error: CSV file is empty.")
    cursor.close()
    db.close()
    exit()


# ==========================================
# Get game name
# ==========================================

game_name = rows[0]["game_name"]


# ==========================================
# Convert game name to table name
# ==========================================

table_name = game_name.lower()
table_name = re.sub(r"[^a-z0-9]+", "_", table_name)
table_name = table_name.strip("_")
table_name += "_reviews"


print(f"Game: {game_name}")
print(f"Table: {table_name}")
print(f"Reviews found: {len(rows)}")


# ==========================================
# Insert reviews
# ==========================================

sql = f"""
INSERT INTO `{table_name}` (
    review_id,
    app_id,
    review_text,
    recommended,
    playtime_hours,
    playtime_at_review_hours,
    helpful_votes
)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""


# ==========================================
# Process rows
# ==========================================

processed = 0

for row in rows:

    recommended = (
        1 if row["recommended"].strip().upper() == "TRUE" else 0
    )

    values = (
        row["review_id"],
        int(row["app_id"]),
        row["review_text"],
        recommended,
        float(row["playtime_hours"])
        if row["playtime_hours"]
        else None,
        float(row["playtime_at_review_hours"])
        if row["playtime_at_review_hours"]
        else None,
        int(row["helpful_votes"])
        if row["helpful_votes"]
        else 0
    )

    cursor.execute(sql, values)

    processed += 1


# ==========================================
# Save changes
# ==========================================

db.commit()


print()
print("==========================================")
print("IMPORT COMPLETE")
print("==========================================")
print(f"Game: {game_name}")
print(f"Table: {table_name}")
print(f"Reviews imported: {processed}")
print("==========================================")


# ==========================================
# Close connection
# ==========================================

cursor.close()
db.close()
