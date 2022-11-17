from app import db
from flask_sqlalchemy import SQLAlchemy


class Img(db.Model):
    __tablename__ = 'use_img'

    _id = db.Column('id', db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('uid'))
    imgData = db.Column(db.String(1000))
    text = db.Column(db.String(1000))

    def __init__(self, uid, imgData, text):
        self.uid = uid
        self.imgData = imgData
        self.text = text

    def create(uid, imgData, text):
        data = Img(uid, imgData, text)
        db.session.add(data)
        db.session.commit()

    def read(uid):
        return Img.query.filter_by(uid=uid)

    
