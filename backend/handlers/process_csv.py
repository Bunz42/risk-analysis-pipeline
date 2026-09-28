"""
S3-triggered Lambda: Downloads CSV, runs each review through
Amazon Comprehend for sentiment + key phrases, writes enriched
records to DynamoDB.
"""

import csv
import io
import json
import os
import uuid
from datetime import datetime
from decimal import Decimal

import boto3

s3 = boto3.client("s3")
comprehend = boto3.client("comprehend")
dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ.get("DYNAMODB_TABLE", "SentimentResults-dev")


def handler(event, context):
    """Handle S3 ObjectCreated events for CSV files."""
    table = dynamodb.Table(TABLE_NAME)
    
    processed = 0
    errors = 0

    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        print(f"Processing s3://{bucket}/{key}")

        # Download CSV from S3
        response = s3.get_object(Bucket=bucket, Key=key)
        body = response["Body"].read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(body))

        for row in reader:
            try:
                result = _process_row(row, table, key)
                if result:
                    processed += 1
            except Exception as e:
                errors += 1
                print(f"Error processing row: {e}")

        print(f"Completed: {processed} processed, {errors} errors")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"Processed {processed} reviews",
            "errors": errors,
        }),
    }


def _process_row(row, table, source_file):
    """Process a single CSV row through Comprehend and store in DynamoDB."""
    # Normalise column names (strip whitespace, lowercase)
    row = {k.strip().lower().replace(" ", "_"): v.strip() for k, v in row.items()}

    review_text = row.get("review_text", row.get("text", row.get("feedback", "")))
    if not review_text:
        return None

    review_id = row.get("review_id", row.get("id", str(uuid.uuid4())))
    customer_name = row.get("customer_name", row.get("name", "Unknown"))
    date = row.get("date", datetime.utcnow().isoformat())

    # --- Amazon Comprehend ---
    sentiment_resp = comprehend.detect_sentiment(
        Text=review_text[:5000],  # Comprehend limit
        LanguageCode="en",
    )

    key_phrases_resp = comprehend.detect_key_phrases(
        Text=review_text[:5000],
        LanguageCode="en",
    )

    sentiment_label = sentiment_resp["Sentiment"]  # POSITIVE | NEGATIVE | NEUTRAL | MIXED
    sentiment_scores = sentiment_resp["SentimentScore"]

    key_phrases = [
        kp["Text"]
        for kp in key_phrases_resp["KeyPhrases"][:10]  # top 10
    ]

    # Determine churn risk based on negative score
    negative_score = sentiment_scores.get("Negative", 0)
    churn_risk = "HIGH" if negative_score >= 0.6 else "MEDIUM" if negative_score >= 0.3 else "LOW"

    # Write to DynamoDB (convert floats to Decimal for DynamoDB)
    item = {
        "reviewId": str(review_id),
        "customerName": customer_name,
        "reviewText": review_text,
        "date": date,
        "sentiment": sentiment_label,
        "sentimentScores": {
            k: Decimal(str(round(v, 4))) for k, v in sentiment_scores.items()
        },
        "keyPhrases": key_phrases,
        "churnRisk": churn_risk,
        "negativeScore": Decimal(str(round(negative_score, 4))),
        "sourceFile": source_file,
        "processedAt": datetime.utcnow().isoformat(),
    }

    table.put_item(Item=item)
    return item
