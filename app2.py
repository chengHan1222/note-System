import os
import pathlib
from flask import Flask, url_for, redirect, render_template, request

from module.imageRecognition import image_to_text_old


SRC_PATH = pathlib.Path(__file__).parent.parent.parent.absolute()
UPLOAD_FOLDER = os.path.join(SRC_PATH, 'user', 'Downloads')


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/', methods=['POST'])
def upload_file():
    file = request.files['filename']
    if file.filename != '':
        file.save(os.path.join(UPLOAD_FOLDER, file.filename))
        print('--------------------')
        print(image_to_text_old(file))
        print('--------------------')
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081, debug=True)
