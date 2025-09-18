
from sqlalchemy import text

def execute_sql_query(db, sql_query: str):
    result = db.execute(text(sql_query)).fetchall()
    return [dict(row._mapping) for row in result]
