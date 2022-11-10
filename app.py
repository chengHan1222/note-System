from flask import Flask, jsonify, session, request, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from flask_sqlalchemy import SQLAlchemy

from config import DevConfig
from datetime import timedelta
from imageRecognition import image_to_text, split_image
import os
from record import getText
from sqlalchemy import null

app = Flask(__name__)
CORS(app)

# app.secret_key = app.config.get('flask', 'secret_key')
app.config['SECRET_KEY'] = os.urandom(24)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)
app.config.from_object(DevConfig)
app.config['JWT_SECRET_KEY'] = 'super-secret'

# Database configure
POSTGRES = {
    'user': 'jason',
    'password': '12345678',
    'db': 'postgres',
    'host': '140.127.74.186',
    'port': '5432',
    'schema': 'public'
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:%(password)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']

db = SQLAlchemy(app)
jwt = JWTManager(app)


class User(db.Model):
    _id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    data = db.Column(db.Text)

    def __init__(self, name, email, password, data):
        self.name = name
        self.email = email
        self.password = password
        self.data = data
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def find_by_email(email):
        return User.query.filter_by(email=email).first()
    
    def check_user(email, password):
        return User.query.filter_by(email=email, password=password).first()


@app.route("/", methods=['GET'])
def home():
    session.permanent = True
    if 'username' in session:
        print(session)
        user = session['username']
    else:
        print(456)
        user = None

    # return render_template('index.html', user=user)
    # render_template('index.html')
    return app.send_static_file('index.html')


@app.route('/login', methods=['POST'])
def login():
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    user = User.check_user(email, password)

    if user:
        session['username'] = user.email
        session['name'] = user.name
        session['data'] = user.data

        # access_token = create_access_token(identity=email)
        return jsonify(message='Login Successful', name=user.name, data=user.data)
        # return jsonify(message='Login Successful', access_token=access_token, name=user.name, data=user.data)
    else:
        return jsonify('Bad email or Password'), 401


@app.route('/register', methods=['POST'])
def register():
    name = request.get_json()["name"]
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    print(name + " " + email + " " + password)

    if (User.find_by_email(email) != None):
        return 'email 已被註冊', 401
    
    user = User(name, email, password, "<p>Welcome to Note System</p>")
    User.save_to_db(user)

    return 'add success'

@app.route('/resetPassword', methods=["POST"])
def resetPassword():
    email = request.get_json()["email"]
    newPassword = request.get_json()["password"]

    if (User.find_by_email(email) != None):
        return 'email 尚未註冊', 401

    user = User.find_by_email(email)
    user.password = newPassword
    db.session.commit()


@app.route('/voice', methods=['POST'])
def voice_text():
    voice = getText(request.files['voice'])
    return voice


@app.route('/image', methods=['POST'])
def image_text():
    imgArray = split_image(request.files["image"])
    result = image_to_text(imgArray)
    return result


@app.route('/get_session/')
def get_session():
    username = session.get('username')
    print(username)
    if username == None:
        return 'None'

    return username


@app.route('/del_session/')
def del_session():
    session.pop('username')  # 只刪除username
    # session.clear()   刪除全部
    return '刪除成功'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # 允許所有主機訪問
