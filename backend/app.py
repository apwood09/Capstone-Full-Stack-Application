# server initialization 
# sets up flask env, configs secret session keys, & integrates bcrypt password security

import os 
from flask import Flask 
from flask_cors import CORS 
from flask_bcrypt import Bcrypt 
from flask_migrate import Migrate 
from models import db 

# initialize core flask application instance
app = Flask(__name__)

# configure secret key for security 
# looks for environment variable ('SECRET_KEY') first; falls back to your fallback string if not found 
app.secret_key = os.environ.get('SECRET_KEY', 'arcane_gold_secret_key_12345')

# tells SQLAlchemy precisely where your db file is located (grimoire.db)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grimoire.db'


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# enable CORS: React frontend can communicate safely during development 
CORS(app, supports_credentials=True)

# links SQLAlchemny db instance to specific Flask application instance 
db.init_app(app)

# initialize Bcrypt to handle secure password hashing & verification: user authentication 
bcrypt = Bcrypt(app)

# initialize Flask-Migrate, linking app & db together to track & apply schema changes (migrations)
migrate = Migrate(app, db)

# import routes here: prevent circular dependency issues 
from routes import *

if __name__ == '__main__': 
    app.run(port=5555, debug=True)