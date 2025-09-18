from app.db.database import Base, engine
from app.models.customer import Customer

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()