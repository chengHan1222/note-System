import os
from flask import Flask, redirect, request, jsonify
from config import DevConfig
from record import getText


app = Flask(__name__)
app.config.from_object(DevConfig)


@app.route("/", methods=['GET'])
def home():
    return app.send_static_file('index.html')
    
@app.route('/voice', methods=['POST'])
def to_text():
    file = request.files['voice']
    if (file.filename == ""):
        return redirect(request.url)
        
    save_path = os.path.join('./', 'temp.wav')
    file.save(save_path)

    voice = getText()
    return voice


if __name__ == '__main__':
    app.run()
