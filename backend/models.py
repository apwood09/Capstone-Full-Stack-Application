# relational db schema 
# defines three related resources (User, Quest, Note) with SQLAlchemy. Contains cascade deletion constriants & automatic password encryption. 

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property 
from flask_bcrypt import Bcrypt

# initialize SQLAchemy & Bcrypt instances 
db = SQLAlchemy()
bcrypt = Bcrypt()

# classes 
# USer
class User(db.Model, SerializerMixin): 
    # db tablename 
    __tablename__ = 'users'

    # prevents infinite recursion loops when converting data to JSON
    serialize_rules = ('-quests.user', '-_password_hash',)

    # column definitions 
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # stores secure, hashed version of password, never plaintext 
    _password_hash = db.Column(db.String(128), nullable=False)

    # cascades ensure deleting user deletes all their data
    quests = db.relationship('Quest', backref='user', lazy=True, cascade="all,, delete-orphan")

    # prevents reading the hash directly via .password_hash 
    @hybrid_property
    def password_hash(self): 
        return self._password_hash

    # automatically intercepts plaintext password, hashes it (Bcrypt)
    # decodes it to UTF-8 string & stores it in hidden db column 
    @password_hash.setter
    def password_hash(self, password): 
        # automatic hash raw passwords before storing 
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # helper method to seurely verify if a user-provided password matches stored hashed 
    def authenticate(self, password): 
        return bcrypt.check_password_hash(self._password_hash, password)

# Quest
class Quest(db.Model, SerializerMixin): 
    __tablename__ = 'quests'

    # prevents infinite recursion loops by stopping the serialization from going back up to the user or down infinitely into notes
    serialize_rules = ('-notes.quest', '-user',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="pending") # 'pending' OR 'completed'

    # foreign key linking quest to its owner in the 'users' table 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # cascades ensure deleting task automatically cleans up sub-notes 
    notes = db.relationship('Note', backref='quest', lazy=True, cascade="all, delete-orphan")

# Note
class Note(db.Model, SerializerMixin): 
    __tablename__ = 'notes'

    # break serialization loop back to parent quest 
    serialize_rules = ('-quest',)

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    # automatically stamps current UTC date & time when a note is created 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # foreign key linking note back to its specific parent quest 
    quest_id = db.Column(db.Integer, db.ForeignKey('quests.id'), nullable=False)