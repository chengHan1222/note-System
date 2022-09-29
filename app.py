from flask import Flask, request, jsonify
from config import DevConfig
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token

from record import getText
from imageRecognition import image_to_text


app = Flask(__name__)
# app.secret_key = config.get('flask', 'secret_key')
CORS(app)

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


@app.route('/login', methods=['GET', 'POST'])
def login():
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    user = User.query.filter_by(email=email, password=password).first()

    if user:
        access_token = create_access_token(identity=email)
        return jsonify(message='Login Successful', access_token=access_token, name=user.name)
    else:
        return jsonify('Bad email or Password'), 401

@app.route('/db', methods=['GET'])
def db():
    content = User.query.filter_by()
    print(content)
    return jsonify(content)

@app.route('/register', methods=['POST'])
def register():
    name = request.get_json()["name"]
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    user = User(name, email, password, "<p>Welcome to Note System</p>")
    db.session.add(user)
    db.session.commit()

    return 'add success'


@app.route('/voice', methods=['POST'])
def voice_text():
    voice = getText(request.files['voice'])
    return voice


@app.route('/image', methods=['POST'])
def image_text():
    result = image_to_text(request.files["image"])
    return result


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
