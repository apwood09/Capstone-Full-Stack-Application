# server initialization 
# sets up flask env, configs secret session keys, & integrates bcrypt password security

import os
from flask import Flask, jsonify
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

    app.secret_key = os.environ.get('SECRET_KEY', 'default_arcane_secret_123')    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grimoire.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

   CORS(app, 
     supports_credentials=True, 
     origins=["https://frontend-daily-chore-grimoire.onrender.com"])

    from models import db

    db.init_app(app)

    with app.app_context():
        db.create_all()
        print("Database tables ensured.")

    Migrate(app, db)

    from routes import bp
    app.register_blueprint(bp)

    @app.errorhandler(Exception)
    def handle_exception(e):
        # This will show the actual Python error instead of the custom string
        return jsonify({"error": "Backend Error", "details": str(e)}), 500

    return app 

app = create_app()

if __name__ == '__main__':
    app.run(port=5555, debug=True)