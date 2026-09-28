import csv
import unicodedata

from lingua import Language, LanguageDetectorBuilder

MIN_WORDS = 5
MIN_UNIQUE_WORDS = 3
MIN_LETTER_RATIO = 0.5
MIN_FUNNY_VOTES = 3
MIN_CHECKBOXES = 3
CHECKBOXES = "☐☑☒✅❌✔"

STEAM_LANGUAGES = [
    Language.ENGLISH, Language.SPANISH, Language.PORTUGUESE, Language.GERMAN,
    Language.FRENCH, Language.TURKISH, Language.POLISH, Language.ITALIAN,
    Language.VIETNAMESE, Language.CZECH, Language.DUTCH, Language.HUNGARIAN,
    Language.INDONESIAN,
]

detector = LanguageDetectorBuilder.from_languages(*STEAM_LANGUAGES).build()


def is_latin(letter):
    return unicodedata.name(letter, "").startswith("LATIN")


def words_only(text):
    return " ".join("".join(c if c.isalpha() else " " for c in text).split())


def junk_reason(review, seen_texts):

    text = (review["review_text"] or "").strip()
    normalized = " ".join(text.lower().split())

    if len(text.split()) < MIN_WORDS:
        return "too short"

    non_space = [c for c in text if not c.isspace()]
    letters = [c for c in non_space if c.isalpha()]

    if len(letters) / len(non_space) < MIN_LETTER_RATIO:
        return "ascii art / symbols"

    if sum(text.count(c) for c in CHECKBOXES) >= MIN_CHECKBOXES:
        return "checkbox template"

    if not all(is_latin(c) for c in letters):
        return "non-latin alphabet"

    if len(set(words_only(text).lower().split())) < MIN_UNIQUE_WORDS:
        return "repeated words"

    if normalized in seen_texts:
        return "duplicate"

    seen_texts.add(normalized)

    funny = int(review["funny_votes"])

    if funny >= MIN_FUNNY_VOTES and funny > int(review["helpful_votes"]):
        return "more funny than helpful"

    if detector.detect_language_of(words_only(text)) != Language.ENGLISH:
        return "not english"

    return None


def filter_reviews(reviews):

    kept = []
    removed = {}
    seen_texts = set()

    for review in reviews:

        reason = junk_reason(review, seen_texts)

        if reason:
            removed[reason] = removed.get(reason, 0) + 1
        else:
            kept.append(review)

    return kept, removed


if __name__ == "__main__":

    app_id = input("Enter Steam App ID: ").strip()

    input_file = f"steam_reviews_{app_id}.csv"
    output_file = f"steam_reviews_{app_id}_filtered.csv"

    with open(input_file, "r", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)
        fieldnames = reader.fieldnames
        reviews = list(reader)

    kept, removed = filter_reviews(reviews)

    with open(output_file, "w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(kept)

    print(f"Kept {len(kept)} of {len(reviews)} reviews")

    for reason, count in removed.items():
        print(f"  removed {count}: {reason}")

    print(f"File created: {output_file}")
