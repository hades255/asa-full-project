#!/usr/bin/env python3
"""
Import Facility, Service, and Media from JSON files into PostgreSQL.
Order: Facility → Service → Media.
Skips rows that already exist (by id).
Profile and Category are assumed already imported.
"""

import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    print("psycopg2 is required. Install with: pip install psycopg2-binary", file=sys.stderr)
    sys.exit(1)

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
DEFAULT_DATABASE_URL = (
    "postgresql://postgres:allspacestestingdb@database-3.cpo4gm02k20v.eu-north-1.rds.amazonaws.com:5432/db_staging?schema=public"
)
# Directory containing Facility.json, Service.json, Media.json
# For this project we keep seed JSON files directly in the seed folder.
SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = SCRIPT_DIR
BATCH_SIZE = 500

# -----------------------------------------------------------------------------
# Logging
# -----------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


def parse_date(s):
    """Parse 'DD/MM/YYYY HH:mm:ss' or 'DD/MM/YYYY HH:mm:ss.SSS' to datetime for PostgreSQL."""
    if s is None:
        return None
    if isinstance(s, datetime):
        return s
    s = str(s).strip()
    # Trim to first 19 chars for DD/MM/YYYY HH:mm:ss, or handle with milliseconds
    s_short = s[:19] if len(s) >= 19 else s
    for fmt in ("%d/%m/%Y %H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(s_short, fmt)
        except ValueError:
            continue
    log.warning("Could not parse date: %s", s)
    return None


def load_json(path: Path):
    """Load JSON array from file."""
    if not path.exists():
        log.error("File not found: %s", path)
        return []
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else []


def import_facility(conn, data_dir: Path, batch_size: int = BATCH_SIZE):
    """Import Facility: id, name, profileId, createdAt, updatedAt."""
    path = data_dir / "Facility.json"
    rows = load_json(path)
    if not rows:
        log.info("Facility: no data in %s", path)
        return 0, 0

    insert_sql = """
        INSERT INTO "Facility" ("id", "name", "profileId", "createdAt", "updatedAt")
        VALUES %s
        ON CONFLICT ("id") DO NOTHING
    """
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        values = []
        for r in batch:
            created = parse_date(r.get("createdAt"))
            updated = parse_date(r.get("updatedAt"))
            if created is None:
                created = datetime.utcnow()
            if updated is None:
                updated = datetime.utcnow()
            values.append((
                str(r.get("id")),
                str(r.get("name", "")),
                str(r.get("profileId", "")),
                created,
                updated,
            ))
        with conn.cursor() as cur:
            execute_values(cur, insert_sql, values, page_size=batch_size)
        if (i + batch_size) % 5000 == 0 or i + batch_size >= len(rows):
            log.info("Facility: processed %d / %d", min(i + batch_size, len(rows)), len(rows))

    with conn.cursor() as cur:
        cur.execute('SELECT COUNT(*) FROM "Facility"')
        total_in_db = cur.fetchone()[0]
    conn.commit()
    log.info("Facility: done. Rows in file: %d. Total Facility rows in DB: %d (existing ids skipped)", len(rows), total_in_db)
    return len(rows), total_in_db


def import_service(conn, data_dir: Path, batch_size: int = BATCH_SIZE):
    """Import Service: id, name, description, minSpend, categoryId, profileId, createdAt, updatedAt."""
    path = data_dir / "Service.json"
    rows = load_json(path)
    if not rows:
        log.info("Service: no data in %s", path)
        return 0, 0

    insert_sql = """
        INSERT INTO "Service" ("id", "name", "description", "minSpend", "categoryId", "profileId", "createdAt", "updatedAt")
        VALUES %s
        ON CONFLICT ("id") DO NOTHING
    """
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        values = []
        for r in batch:
            created = parse_date(r.get("createdAt"))
            updated = parse_date(r.get("updatedAt"))
            if created is None:
                created = datetime.utcnow()
            if updated is None:
                updated = datetime.utcnow()
            values.append((
                str(r.get("id")),
                str(r.get("name", "")),
                r.get("description"),
                float(r.get("minSpend", 0) or 0),
                r.get("categoryId"),
                r.get("profileId"),
                created,
                updated,
            ))
        with conn.cursor() as cur:
            execute_values(cur, insert_sql, values, page_size=batch_size)
        if (i + batch_size) % 5000 == 0 or i + batch_size >= len(rows):
            log.info("Service: processed %d / %d", min(i + batch_size, len(rows)), len(rows))

    with conn.cursor() as cur:
        cur.execute('SELECT COUNT(*) FROM "Service"')
        total_in_db = cur.fetchone()[0]
    conn.commit()
    log.info("Service: done. Total rows in file: %d. Total Service rows in DB: %d", len(rows), total_in_db)
    return len(rows), total_in_db


def import_media(conn, data_dir: Path, batch_size: int = BATCH_SIZE):
    """Import Media: id, filePath, fileType, profileId, serviceId, createdAt, updatedAt. fileType must be JPG/PNG/SVG/MP4."""
    path = data_dir / "Media.json"
    rows = load_json(path)
    if not rows:
        log.info("Media: no data in %s", path)
        return 0, 0

    ALLOWED_FILE_TYPES = ("JPG", "PNG", "SVG", "MP4")
    insert_sql = """
        INSERT INTO "Media" ("id", "filePath", "fileType", "profileId", "serviceId", "createdAt", "updatedAt")
        VALUES %s
        ON CONFLICT ("id") DO NOTHING
    """
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        values = []
        for r in batch:
            created = parse_date(r.get("createdAt"))
            updated = parse_date(r.get("updatedAt"))
            if created is None:
                created = datetime.utcnow()
            if updated is None:
                updated = datetime.utcnow()
            ft = str(r.get("fileType", "JPG")).upper()
            if ft not in ALLOWED_FILE_TYPES:
                ft = "JPG"
            values.append((
                str(r.get("id")),
                str(r.get("filePath", "")),
                ft,
                r.get("profileId"),
                r.get("serviceId"),
                created,
                updated,
            ))
        with conn.cursor() as cur:
            execute_values(cur, insert_sql, values, page_size=batch_size)
        if (i + batch_size) % 5000 == 0 or i + batch_size >= len(rows):
            log.info("Media: processed %d / %d", min(i + batch_size, len(rows)), len(rows))

    with conn.cursor() as cur:
        cur.execute('SELECT COUNT(*) FROM "Media"')
        total_in_db = cur.fetchone()[0]
    conn.commit()
    log.info("Media: done. Total rows in file: %d. Total Media rows in DB: %d", len(rows), total_in_db)
    return len(rows), total_in_db


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Import Facility, Service, Media from JSON to PostgreSQL")
    parser.add_argument(
        "--db",
        default=os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL),
        help="PostgreSQL connection URL",
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path(os.environ.get("SEED_DATA_DIR", str(DEFAULT_DATA_DIR))),
        help="Directory containing Facility.json, Service.json, Media.json",
    )
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE, help="Insert batch size")
    args = parser.parse_args()

    if not args.data_dir.is_dir():
        log.error("Data directory does not exist: %s", args.data_dir)
        sys.exit(1)

    # Parse URL for psycopg2: remove ?schema=public (use search_path if needed)
    url = args.db
    if "?" in url:
        url, qs = url.split("?", 1)
        # optional: set search_path to public
    log.info("Connecting to database...")
    try:
        conn = psycopg2.connect(url)
        conn.autocommit = False
    except Exception as e:
        log.error("Connection failed: %s", e)
        sys.exit(1)

    try:
        with conn:
            # Set schema so unquoted names resolve to public
            with conn.cursor() as cur:
                cur.execute('SET search_path TO public')
            log.info("Import order: Facility → Service → Media (existing id will be skipped)")
            import_facility(conn, args.data_dir, args.batch_size)
            import_service(conn, args.data_dir, args.batch_size)
            import_media(conn, args.data_dir, args.batch_size)
        log.info("All imports finished.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
