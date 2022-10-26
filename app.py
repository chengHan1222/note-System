from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import null

from config import DevConfig
from imageRecognition import image_to_text, split_image
from record import getText

app = Flask(__name__)
CORS(app)

# app.secret_key = app.config.get('flask', 'secret_key')
app.config.from_object(DevConfig)
app.config['JWT_SECRET_KEY'] = 'super-secret'

# Database configure
POSTGRES = {
    'user': 'postgres',
    'password': '891222',
    'db': 'notion',
    'host': 'localhost',
    'port': '5432',
    'schema': 'public'
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:%(password)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)


class User(db.Model):
    _id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    data = db.Column(db.Text)

    def __init__(self, name, email, password, data) -> None:
        self.name = name
        self.email = email
        self.password = password
        self.data = data


@app.route("/", methods=['GET'])
def home():
    return app.send_static_file('index.html')


@app.route('/login', methods=['POST'])
def login():
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    user = User.query.filter_by(email=email, password=password).first()

    if user:
        access_token = create_access_token(identity=email)
        return jsonify(message='Login Successful', access_token=access_token, name=user.name, data=user.data)
    else:
        return jsonify('Bad email or Password'), 401


@app.route('/register', methods=['GET','POST'])
def register():
    name = request.get_json()["name"]
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    if (User.query.filter_by(email=email).first() != null):
        return 'email 已被註冊', 401

    user = User(name, email, password, "<p>Welcome to Note System</p>")
    db.session.add(user)
    db.session.commit()

    return 'add success'


@app.route('/updateDB', methods=['GET', 'POST'])
def updateDB():
    name = request.get_json()["name"]
    data = request.get_json()["data"]
    User.query.filter_by(name=name).update(dict(data=data))
    db.session.commit()

    return 'ok'


@app.route('/voice', methods=['POST'])
def voice_text():
    voice = getText(request.files['voice'])
    return voice


@app.route('/image', methods=['POST'])
def image_text():
    imgArray = split_image(request.files["image"])
    print('------------------')
    result = image_to_text(imgArray)
    return result


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) #允許所有主機訪問
