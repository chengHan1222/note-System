import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from flask_sqlalchemy import SQLAlchemy

from module.imageRecognition import image_to_text_old
from module.record import get_text as get_record_text
from module.keyWord import find_keyword

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from base64 import b64encode

app = Flask(__name__)
CORS(app)

CONFIGS = {
    "ENV": "development",
    "DEBUG": True
}
app.config.from_object(CONFIGS)
app.config['JWT_SECRET_KEY'] = 'super-secret'
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']

jwt = JWTManager(app)

# ----------------------------------------------------------------------------------------------------------
# Database configure
POSTGRES = {
    'user': 'jason',
    'password': base64.b64decode('MTIzNDU2Nzg=').decode('utf-8'),
    'db': 'postgres',
    'host': base64.b64decode('MTQwLjEyNy43NC4xODY=').decode('utf-8'),
    'port': '5432',
    'schema': 'public'
}

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://%(user)s:%(password)s@%(host)s:%(port)s/%(db)s' % POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(1000), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    data = db.Column(db.Text)

    def __init__(self, token, name, email, password, data):
        self.token = token
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

    def find_by_token(self, token):
        return self.query.filter_by(token=token).first()

    def find_by_email(self, email):
        return self.query.filter_by(email=email).first()

    def check_user(self, email, password):
        return self.query.filter_by(email=email, password=password).first()

    def saveData(self, email, data):
        user = self.query.filter_by(email=email).first()
        user.data = data
        db.session.commit()


class Img(db.Model):
    __tablename__ = 'img'

    imgId = db.Column(db.String(1000), primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))
    imgData = db.Column(db.LargeBinary)
    imgText = db.Column(db.String(1000))
    imgKeyword = db.Column(db.String(1000))

    def __init__(self, img_id, uid, data, text, keyword):
        self.imgId = img_id
        self.uid = uid
        self.imgData = data
        self.imgText = text
        self.imgKeyword = keyword

    def create(self):
        db.session.add(self)
        db.session.commit()

    def search(self, img_id):
        return self.query.filter_by(imgId=img_id).first()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def get_all_img(self, uid):
        return self.query.filter_by(uid=uid).all()
# ----------------------------------------------------------------------------------------------------------

@app.cli.command()
def test():
    import unittest
    import sys
 
    tests = unittest.TestLoader().discover("tests")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.errors or result.failures:
        sys.exit(1)

@app.route("/", methods=['GET'])
@app.route("/MainPage", methods={'GET'})
def home():
    return app.send_static_file('index.html')


@app.route('/removeUser', methods=['POST'])
def remove_user():
    email = str(base64.b64decode(request.form["email"]), 'utf-8')
    password = str(base64.b64decode(request.form["password"]), 'utf-8')
    user = User.check_user(User, email, password)
    if (user):
        User.delete(user)
        return 'Delete User Success'
    else:
        return 'User is not exist'


@app.route('/register', methods=['POST'])
def register():
    name = str(base64.b64decode(request.get_json()["name"]), 'utf-8')
    email = str(base64.b64decode(request.get_json()["email"]), 'utf-8')
    password = str(base64.b64decode(request.get_json()["password"]), 'utf-8')
    data = request.get_json()["defaultData"]

    if (User.find_by_email(User, email) != None):
        return 'email 已被註冊', 401

    access_token = create_access_token(identity=email)

    user = User(access_token, name, email, password, data)
    User.save_to_db(user)

    return 'add success'


@app.route('/login', methods=['POST'])
def login():
    email = str(base64.b64decode(request.get_json()["email"]), 'utf-8')
    password = str(base64.b64decode(request.get_json()["password"]), 'utf-8')

    user = User.check_user(User, email, password)
    if user:
        return jsonify(message='Login Successful', token=user.token, name=user.name)
    else:
        return jsonify('Bad email or Password'), 401


@app.route('/check_token', methods=["POST"])
def check_token():
    token = request.get_json()["token"]
    user = User.find_by_token(User, token)
    img = Img.get_all_img(Img, user.uid)

    img_array = []
    for i in img:
        img_array.append({
            "imgId": i.imgId,
            "imgData": b64encode(i.imgData).decode('utf-8'),
            "imgText": i.imgText,
            "imgKeyword": i.imgKeyword,
        })

    return jsonify(message='succ', name=user.name, data=user.data, email=user.email, uid=user.uid, img=img_array)


@app.route('/findAccount', methods=['POST'])
def find_account():
    email = request.get_json()["email"]
    user = User.query.filter_by(email=email).first()
    if user:
        send_mail(email)
        return jsonify(message="succ", name=user.name)
    else:
        return jsonify("email not found"), 401


def send_mail(to):
    http = "http://localhost:3000/ResetPassword/%s" % to
    msg_text = "<a href=%s>%s<a>" % (http, http)
    print(http)

    content = MIMEMultipart()
    content["subject"] = "Simple Note Reset Password"
    content["from"] = "SimpleNoteOfficalMail@gmail.com"
    content["to"] = to
    content.attach(MIMEText(msg_text, "html", "utf-8"))

    smtp = smtplib.SMTP("smtp.gmail.com", 587)
    print('connect')
    smtp.ehlo()
    print('ehlo')
    smtp.starttls()

    smtp.login("SimpleNoteOfficalMail@gmail.com", "lftgdkdlfdehhfba")
    print("login")

    try:
        smtp.send_message(content)
        print("succ")
        smtp.quit()
    except Exception as e:
        print("error", e)


@app.route('/resetPassword', methods=["POST"])
def reset_password():
    email, new_password = request.get_json()["email"], request.get_json()[
        "password"]
    if (User.find_by_email(User, email) == None):
        return 'email 尚未註冊', 401

    user = User.find_by_email(User, email)
    user.password = new_password
    db.session.commit()
    return jsonify(message="succ", name=user.name)


@app.route('/voice', methods=['POST'])
def voice_text():
    file = request.files['voice']

    text = get_record_text(file)
    keyword = find_keyword(text)
    return jsonify(text=text, keyword=keyword)


@app.route('/voiceLive', methods=['POST'])
def voice_live_text():
    file = request.files['voice']

    text = get_record_text(file)
    if (text == "無法翻譯"):
        text = ""
    return jsonify(text=text)


@app.route('/uploadImg', methods=['POST'])
def upload_img():
    img_id = request.form.get("imgId")
    uid = request.form.get("uid")
    img_data = request.files["image"]
    byte = img_data.read()

    text = image_to_text_old(img_data)
    keyword = find_keyword(text)

    new_img = Img(img_id, uid, byte, text, keyword)
    Img.create(new_img)

    img = Img.get_all_img(Img, uid)
    img_array = []
    for i in img:
        img_array.append({
            "imgId": i.imgId,
            "imgData": b64encode(i.imgData).decode('utf-8'),
            "imgText": i.imgText,
            "imgKeyword": i.imgKeyword,
        })

    return jsonify(img=img_array)


@app.route('/removeImg', methods=['POST'])
def remove_img():
    img_id = request.get_json()["imgId"]
    img = Img.search(Img, img_id)
    if (img):
        Img.delete(img)
    return 'ok'


@app.route('/saveUserData', methods=['POST'])
def save_data():
    email = request.get_json()["email"]
    file = request.get_json()["data"]
    User.saveData(User, email, file)
    return "ok"


@app.route('/test', methods=['GET'])
def test():
    sql = db.session.execute("SELECT name FROM public.user")
    print(sql)
    return 'test'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # 允許所有主機訪問