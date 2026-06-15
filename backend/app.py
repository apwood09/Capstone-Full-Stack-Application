# server initialization 
# sets up flask env, configs secret session keys, & integrates bcrypt password security

import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'arcane_secret_999')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grimoire.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)

from routes import *

if __name__ == '__main__':
    app.run(port=5555, debug=True)