from faker import Faker
from backend.database import engine
from backend.models import URL, User
from sqlalchemy.orm import Session
from sqlalchemy import insert
import random

fake = Faker()

def seed_database():
    with Session(engine) as db :
        try :
            # making fake users
            print("Making 5000 fake users......")
            users_to_insert = []
            for i in range(5000):
                users_to_insert.append({
                    "email": fake.unique.email(),
                    "password": "1234"
                })
            
            db.execute(insert(User), users_to_insert)
            db.commit()
            
            print("Users table created successfully.")
            
            users = db.query(User.id).all()
            users_list = [u[0] for u in users]
            
            print("Generating 50,000 URLs... please wait.")
            urls_to_insert = []
            for i in range(50000):
                urls_to_insert.append({
                    "user_id": random.choice(users_list),
                    "original_url": fake.url(),
                    "short_code": fake.unique.bothify(text="????##")
                })
                
                if (i+1) % 5000 == 0:
                    db.execute(insert(URL), urls_to_insert)
                    db.commit()
                    print(f"{i + 1} URLs saved in database")
                    urls_to_insert = []
                
    
            print("Successfully inserted 50,000 URL records!")
            
        except Exception as e:
            db.rollback()
            print(f"Error {e}")
            
        
if __name__ == "__main__":
    seed_database()