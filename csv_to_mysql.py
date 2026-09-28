import csv
import os
from getpass import getpass
import mysql.connector

# Ask which Steam game to import
app_id = input("Enter Steam App ID: ").strip()

# CSV filename (must match the name SteamGameReviewer.py saves)
filename = f"steam_reviews_{app_id}.csv"

# MySQL password comes from the MYSQL_PASSWORD environment variable
# so nobody has to type their real password into the code.
# If it isn't set, ask for it instead.
password = os.environ.get("MYSQL_PASSWORD")

if not password:
    password = getpass("MySQL password: ")

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password=password,
    database="game_reviews"
)

cursor = db.cursor()

# Open CSV
with open(filename, "r", encoding="utf-8-sig") as file:
    reader = csv.DictReader(file)

    print("CSV columns:", reader.fieldnames)

    for row in reader:

        # Convert TRUE/FALSE to 1/0 for MySQL BOOLEAN
        recommended = 1 if row["recommended"].upper() == "TRUE" else 0

        sql = """
        INSERT INTO reviews (
            app_id,
            review_text,
            recommended,
            playtime_hours,
            playtime_at_review_hours,
            helpful_votes
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        """

        values = (
            row["app_id"],
            row["review_text"],
            recommended,
            row["playtime_hours"],
            row["playtime_at_review_hours"],
            row["helpful_votes"]
        )

        cursor.execute(sql, values)

# Save changes
db.commit()

cursor.close()
db.close()

print(f"Reviews for Steam App {app_id} successfully imported!")