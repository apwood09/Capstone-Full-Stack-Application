# secure API architecture
# handles complete authentication routing & granular CRUD endpoints, isolating user scopes through standard Flask cookies(session)

from flask import Blueprint, request, session, jsonify
from models import db, User, Quest

bp = Blueprint('routes', __name__)

@bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "This soul is already bound to the Grimoire"}), 409

    try:
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()

        print(f"Error during registration: {e}") 
        return jsonify({"error": "Failed to bind new user to the Grimoire"}), 400

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.check_password(data.get('password')):
            session['user_id'] = user.id
            return jsonify(user.to_dict()), 200
        return jsonify({"error": "Invalid incantation"}), 401
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "A disruption occurred in the arcane network"}), 500

@bp.route('/api/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        return jsonify(user.to_dict()), 200
    return jsonify({"error": "No active session"}), 401

@bp.route('/api/quests', methods=['GET', 'POST'])
def manage_quests():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    if request.method == 'POST':
        data = request.get_json() # ONLY call if POST
        print(f"DEBUG: Data received: {data}")
        
        try:
            new_quest = Quest(title=data.get('title'), user_id=user_id)
            db.session.add(new_quest)
            db.session.commit()
            return jsonify(new_quest.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            print(f"DEBUG ERROR: {e}")
            return jsonify({"error": str(e)}), 500

    # runs if method is GET
    quests = Quest.query.filter_by(user_id=user_id).all()
    return jsonify([q.to_dict() for q in quests]), 200

@bp.route('/api/quests/<int:id>', methods=['DELETE'])
def delete_quest(id):
    try:
        quest = Quest.query.get(id)
        if not quest:
            return jsonify({"error": "Quest not found"}), 404
        db.session.delete(quest)
        db.session.commit()
        return jsonify({"message": "Quest banished"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to banish quest"}), 500