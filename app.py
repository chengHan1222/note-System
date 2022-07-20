from flask import Flask, redirect, request, jsonify
from config import DevConfig
from flask_cors import CORS
import base64

from record import getFileText, getTest

app = Flask(__name__)
CORS(app)
app.config.from_object(DevConfig)


@app.route("/", methods=['GET'])
def home():
    return app.send_static_file('index.html')

@app.route('/voice', methods=['POST'])
def voice_text():
    # dataJS = request.json
    # voice = getFileText(dataJS.get("content").values, dataJS.get("rate"))
    # print(dataJS.get("content").keys())
    voice = getTest(request.files['voice'])
    return voice

@app.route('/voiceFile', methods=['POST'])
def voice_file_text():
    dataJS = request.json
    voice = getFileText(base64.b64decode(dataJS.get("content")))
    # voice = base64.b64decode(request.json.get("content"))
    # print(base64.b64decode(request.json.get("content")))
    return voice


if __name__ == '__main__':
    app.run()
