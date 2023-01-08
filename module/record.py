import speech_recognition as sr
import soundfile as sf
import librosa

def get_text(voice_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(voice_file) as sourse:
        data = recognizer.record(sourse)
    try:
        return recognizer.recognize_google(data, language="zh_TW")
        
    except Exception:
        return '無法翻譯'