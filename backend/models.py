# relational db schema 
# defines three related resources (User, Quest, Note) with SQLAlchemy. Contains cascade deletion constriants & automatic password encryption. 

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
import bcrypt

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-quests.user', '-password_hash')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    quests = db.relationship('Quest', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(
            password.encode('utf-8'), 
            self.password_hash.encode('utf-8')
        )

class Quest(db.Model, SerializerMixin):
    __tablename__ = 'quests'
    serialize_rules = ('-notes.quest', '-user')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="pending")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notes = db.relationship('Note', backref='quest', lazy=True, cascade="all, delete-orphan")

class Note(db.Model, SerializerMixin):
    __tablename__ = 'notes'
    serialize_rules = ('-quest',)

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    quest_id = db.Column(db.Integer, db.ForeignKey('quests.id'), nullable=False)