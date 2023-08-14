from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS

import jwt
import datetime
import mysql.connector
import bcrypt

app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'sexyabhi'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'chat'

mysql = MySQL(app)


def generate_token(id):
    payload = {
        'user_id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


def get_user_id_from_token(token):
    try:
        payload = jwt.decode(
            token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']

    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Connect to MySQL database
    cur = mysql.connection.cursor()

    # Check if the username or email already exists
    cur.execute("SELECT * FROM user WHERE username=%s OR email=%s",
                (username, email))
    existing_user = cur.fetchone()

    if existing_user:
        cur.close()
        return jsonify({'message': 'Username or email already exists'}), 400

    # Insert new user into the database
    cur.execute("INSERT INTO user (username, password, email) VALUES (%s, %s, %s)",
                (username, hashed_password, email))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Signup successful'}), 201


@app.route('/login', methods=['POST'])
def login(): 
    data = request.get_json()
    username = data['username']
    password = data['password']
    print(data) 

    # Connect to MySQL database
    cur = mysql.connection.cursor()

    # Retrieve hashed password from the database based on the username
    cur.execute("SELECT id, password FROM user WHERE username=%s", (username,))
    user = cur.fetchone()
    cur.close()

    if not user:
        return jsonify({'message': 'Invalid username or password'}), 401

     # Check if the provided password matches the stored hashed password
    if bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
        # Generate token for the authenticated user
        # Assuming user[0] is the user_id in the database
        token = generate_token(user[0])
        return jsonify({'token': token, 'user_id': user[0]}), 200

    return jsonify({'message': 'Invalid username or password'}), 401


@app.route('/users', methods=['GET'])
def get_users():
    token = request.args.get('token', None)

    if not token:
        return jsonify({'message': 'Missing token'}), 400

    request_user_id = get_user_id_from_token(token)
    if not request_user_id:
        return jsonify({'message': 'Invalid or expired token'}), 401

    # Connect to MySQL database
    cur = mysql.connection.cursor()

    # Fetch all users from the user table
    cur.execute("SELECT id, username FROM user WHERE id != %s",
                (request_user_id,))
    users = [{'id': user_id, 'username': username}
             for user_id, username in cur.fetchall()]

    cur.close()

    return jsonify(users), 200


@app.route('/send-message', methods=['POST'])
def send_message():
    data = request.get_json()
    print(data)
    token = data.get('token', None)
    recevier_id = data.get('recevier_id', None)
    sender_id = data.get('user_id', None)
    content = data.get('content', None)

    # if not token or not receiver_id or not content:
    if not token or not content:
        return jsonify({'message': 'Missing required fields'}), 400

    if not sender_id:
        return jsonify({'message': 'Invalid or expired token'}), 401

    # Connect to MySQL database
    cur = mysql.connection.cursor()

    # Insert new message into the messages table
    cur.execute("INSERT INTO messages (sender_id, receiver_id, content) VALUES (%s, %s, %s)",
                (sender_id, recevier_id, content))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Message sent successfully'}), 201


@app.route('/messages/<int:recevier_id>,<int:user_id>', methods=['GET'])
def get_messages(recevier_id, user_id):
    token = request.args.get('token', None)

    if not token:
        return jsonify({'message': 'Missing token'}), 400

    if not recevier_id:
        return jsonify({'message': 'Invalid or expired token'}), 401
    print(recevier_id, user_id)

    # Connect to MySQL database
    cur = mysql.connection.cursor()
    # Fetch previous conversations between the two users
    cur.execute("SELECT id, sender_id, content, timestamp FROM messages WHERE (sender_id=%s AND receiver_id=%s) OR (sender_id=%s AND receiver_id=%s) ORDER BY timestamp",
                (user_id, recevier_id, recevier_id, user_id))
    messages = [{'id': msg_id, 'sender_id': sender_id, 'content': content, 'timestamp': str(timestamp)}
                for msg_id, sender_id, content, timestamp in cur.fetchall()]

    cur.close()

    return jsonify(messages), 200


if __name__ == '__main__':
    app.run(debug=True)
