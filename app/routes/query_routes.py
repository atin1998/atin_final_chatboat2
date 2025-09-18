from fastapi import APIRouter, HTTPException,Depends
from pydantic import BaseModel
from app.services.llm_service import generate_sql_from_prompt
from app.utils.sql_executor import execute_sql_query
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.customer import Customer

router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
class CustomerCreate(BaseModel):
    customer_id: int
    name: str
    gender: str
    location: str

class PromptInput(BaseModel):
    prompt: str

@router.post("/query")
async def handle_prompt(prompt_input: PromptInput, db: Session = Depends(get_db)):
    try:
        prompt = prompt_input.prompt

        sql_query = generate_sql_from_prompt(prompt)

     
        results = execute_sql_query(db,sql_query)


        return {
            "generated_sql": sql_query,
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/customers")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    try:
        new_customer = Customer(
            customer_id=customer.customer_id,
            name=customer.name,
            gender=customer.gender,
            location=customer.location,
        )
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)
        return {"message": "Customer added successfully", "customer": {
            "customer_id": new_customer.customer_id,
            "name": new_customer.name,
            "gender": new_customer.gender,
            "location": new_customer.location,
        }}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
