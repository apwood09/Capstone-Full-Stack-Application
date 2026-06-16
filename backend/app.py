# server initialization 
# sets up flask env, configs secret session keys, & integrates bcrypt password security

import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

def create_app():
    app = Flask(__name__)

    app.config.update(
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=True, 
    SESSION_COOKIE_HTTPONLY=True,
)

    app.secret_key = os.environ.get('SECRET_KEY', 'arcane_secret_999')    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grimoire.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, 
     supports_credentials=True, 
     origins=["https://frontend-daily-chore-grimoire.onrender.com"])

    from models import db

    db.init_app(app)
    Migrate(app, db)

    from routes import bp
    app.register_blueprint(bp)

    return app 

app = create_app()

if __name__ == '__main__':
    app.run(port=5555, debug=True)