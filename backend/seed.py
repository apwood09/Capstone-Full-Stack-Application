from app import app, db
from models import User, Quest

with app.app_context():
    print("Clearing the Grimoire...")
    db.drop_all()
    db.create_all()

    print("Summoning initial data...")
    test_user = User(username="Archmage")
    test_user.set_password("password123")
    
    db.session.add(test_user)
    db.session.commit()

    quest1 = Quest(title="Master the React Arts", user_id=test_user.id)
    db.session.add(quest1)
    db.session.commit()

    print("The Grimoire is ready.")