from flask import Flask
from flask_mail import Mail, Message
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


app = Flask(__name__)
app.config['MAIL_SERVER'] = "smtp.gmail.com"
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = "qaz8155699@gmail.com"
app.config['MAIL_PASSWORD'] = "oktbpjpekxcehzga"
app.config['MAIL_DEFAULT_SENDER'] = "simplenote@mail.com"
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_SUPPRESS_SEND'] = False
app.config['MAIL_ASCII_ATTACHEMNTS'] = False

mail = Mail(app)


@app.route('/')
def index():
    msg = Message(recipients=['qaz8155699@gmail.com'])
    msg.subject = "<p>simple note reset password</p>"
    msg.html = "<a href='http://localhost:5000/setPassword'>http://localhost:5000/setPassword<a>"
    print("send")
    mail.send(msg)

    return "succ"


if __name__ == "__main__":
    msg_text = "<a href='http://localhost:5000/setPassword'>http://localhost:5000/setPassword<a>"

    
    content = MIMEMultipart()
    content["subject"] = "Simple Note Reset Password"
    content["from"] = "SimpleNoteOfficalMail@gmail.com"
    content["to"] = "qaz8155699@gmail.com"
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

    