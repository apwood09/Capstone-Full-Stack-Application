# secure API architecture
# handles complete authentication routing & granular CRUD endpoints, isolating user scopes through standard Flask cookies(session)

from flask import request, session, jsonify
from app import app, db
from models import User, Quest, Note 

# Authentication Routes 
# register: POST; handles new user onboarding 
@app.route('/api/register', methods=['POST'])
def register(): 
    # extract JSON payload sent by frontend 
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    # guard clause: ensure no required registration fields are blank 
    if not username  or not email or not password: 
        return jsonify({"error": "Missing required fields"}), 400
    
    # validation clause: ensure username or email isn't already taken in our DB 
    if User.query.filter((User.username == username) | (User.email == email)).first(): 
        return jsonify({"error": "User or email already exists"}), 400
    
    try: 
        # create new user instance
        new_user = User(username=username, email=email, password_hash=password)
        db.session.add(new_user)
        db.session.commit()

        # log user in immediately after registering by saving ID to Flask's secure session cookie 
        session['user_id'] = new_user.id 
        return jsonify(new_user.to_dict()), 201 
    except Exception as e:
        # if db insert crashes, rollback changes to keep db clean 
        db.session.rollback()
        return jsonify ({"error": "Database error during registration", "details": str(e)}), 500

#login: POST; verifies user credentials & establish session 
@app.route('/api/login', methods=['POST'])
def login(): 
    data = request.get_json()
    # find user by their unique username 
    user = User.query.filter_by(username=data.get('username')).first()

    # securely compares raw login password with hashed db password 
    if user and user.authenticate(data.get('password')):
        # store authenticated user's ID inside encrypted session cookie 
        session['user_id'] = user.id
        return jsonify(user.to_dict()), 200

    # fallback generic error message 
    return jsonify({"error": "Invalid username or password"}), 401 

# logout: DELETE; ends user session 
@app.route('/api/logout', methods=['DELETE'])
def logout():

    # remove user's ID from session cookie, effectively logging them out
    session.pop('user_id', None)
    return jsonify({"message": "Successfully logged out"}), 200

# check session: GET; allows Reat frontend see "who is currently logged in" on page refresh 
@app.route('/api/check_session', methods=['GET'])
def check_session(): 

    # grab user ID from session cookie if it exists
    user_id = session.get('user_id')
    if user_id: 
        # look up user in db
        user = User.query.get(user_id)
        if user: 
            # If found: return user object data
            return jsonify(user.to_dict()), 200
    return jsonify({"error": "Unauthorized. Please log in."}), 401

# Quest (task) CRUD Routes 
# quests: GET, POST; handles listing quest or creating a new one 
@app.route('/api/quests', methods=['GET', 'POST'])
def handle_quests():
    # guard clause: ensures user is logged in before allowing access to quests
    user_id = session.get('user_id')
    if not user_id: 
        return jsonify({"error": "Unauthorized"}), 401
    
    # GET logic: Fetch ALL quests belonging to logged-in user
    if request.method == 'GET': 
        quests = Quest.query.filter_by(user_id=user_id).all()
        # Ccnvert Python list of objects into SON-serialized array
        return jsonify([quest.to_dict() for quest in quests]), 200

    # POST Logic: add brand new quest scoped to the logged-in user
    if request.method == 'POST': 
        data = request.get_json()
        title = data.get('title')

        if not title: 
            return jsonify({"error": "Quest title is required"}), 400

        try: 
            # link this quest to the logged-in user using the 'user_id' pulled from the session
            new_quest = Quest(title=title, status="pending", user_id=user_id)
            db.session.add(new_quest)
            db.session.commit()
            return jsonify(new_quest.to_dict()), 201
        except Exception as e: 
            db.session.rollback()
            return jsonify({"error": "failed to create quest", "details": str(e)}), 500

# individual quests route: updating (PATCH) or destroying (DELETE) specific quest 
@app.route('/api/quests/<int:id>', methods=['PATCH', 'DELETE'])
def handle_quest_by_id(id):
    # authenticate user
    user_id = session.get('user_id')
    if not user_id: 
        return jsonify({"error": "Unauthorized"}), 401
    
    # CRITICAL SECURITY STEP: filter by both quest ID & current user_id. 
    # prevents User A from maliciously modifying or deleting User B's quests 
    quest = Quest.query.filter_by(id=id, user_id=user_id).first()
    if not quest: 
        return jsonify({"error": "Quest not found"}), 404
    
    # PATCH logic: partially update properties of found quest
    if request.method == 'PATCH': 
        data = request.get_json()

        # dynamically check what the user wants to update: title, status or both
        if 'title' in data: 
            quest.title = data['title']
        if 'status' in data: 
            quest.status = data['status']
        
        try: 
            db.session.commit()
            return jsonify(quest.to_dict()), 200
        except Exception as e: 
            db.session.rollback()
            return jsonify({"error": "failed to update quest", "details": str(e)}), 500
    
    # DELETE logic: remove quest from the db 
    if request.method == 'DELETE': 
        try: 
            db.session.delete(quest)
            db.session.commit()
            return jsonify({"message": "Quest vanished into the void successfully"}), 200
        except Exception as e: 
            db.session.rollback()
            return jsonify({"error": "Failed to delete quest", "details": str(e)}), 500

# Note Routes 
#POST: adds contextual note to existing quest
@app.route('/api/quests/<int:quest_id>/notes', methods=['POST'])
def add_note_to_quest(quest_id): 
    # authenticate user
    user_id = session.get('user_id')
    if not user_id: 
        return jsonify({"error": "Unauthorized"}), 401
    
    # quests belongs to logged-in user
    # CRITICAL SECURITY STEP: before note appending, confirm quest belongs to logged-in user
    quest = Quest.query.filter_by(id=quest_id, user_id=user_id).first()
    if not quest: 
        return jsonify({"error": "Quest not found"}), 404
    
    data = request.get_json()
    content = data.get('content')

    if not content: 
        return jsonify({"error": "Note content cannot be empty"}), 400

    try:
        # create note & bind to confirmed quest via 'quest_id' foreign key
        new_note = Note(content=content, quest_id=quest_id)
        db.session.add(new_note)
        db.session.commit()
        return jsonify(new_note.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add note", "details": str(e)}), 500