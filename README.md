# 🔮 The Daily Grimoire

The Daily Grimoire is a full-stack productivity tracker infused with a mystical, arcane aesthetic. Manage your daily tasks as "Quests" and keep track of your progress with a secure, authenticated, and aesthetically pleasing interface.

## 🌟 Features

* **Arcane Authentication:** Secure user registration and login using encrypted sessions (Bcrypt).
* **Quest Management:** Create, track, and banish (delete) your daily tasks.
* **Mystical UI/UX:** A bespoke user interface featuring Midnight Purple, Arcane Gold, and parchment-style typography.
* **Relational Database:** Robust backend schema built with SQLAlchemy, featuring cascading deletions to keep your grimoire clean.
* **State Management:** Seamless frontend state handling using React Context API (`AuthContext` & `QuestContext`).

## 🛠️ Tech Stack

**Backend (The Arcane Core)**
* Python 3
* Flask & Flask-RESTful
* SQLAlchemy & Flask-Migrate (SQLite database)
* Flask-Bcrypt (Password Hashing)
* Flask-CORS

**Frontend (The Visual Runes)**
* React (via Vite)
* React Router v6
* React Context API
* Custom CSS (Arcane Theme)

---

## 🚀 Local Setup & Installation

To run this application locally, you will need two terminal windows open: one for the backend server and one for the frontend development server.

### Prerequisites
* Python 3.8+
* Node.js (v16+)
* `pip` or `pipenv`

### Part 1: Backend Setup

Open a terminal and navigate to the backend directory:
cd backend

Install the required Python dependencies:
pip install -r requirements.txt

Initialize the database and run migrations:

flask db init
flask db migrate -m "Initial migration"
flask db upgrade

Seed the database with the initial Archmage user:
python seed.py

Start the Flask server:
python app.py

The backend will now run on http://127.0.0.1:5555

### Part 2: Frontend Setup

Open a new terminal window and navigate to the frontend directory:
cd frontend

Install the required Node dependencies:
npm install

Start the Vite development server:
npm run dev

The frontend will now run on http://localhost:5173 (or the port specified in your terminal)

