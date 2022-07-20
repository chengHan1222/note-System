#!/usr/bin/env python3
import speech_recognition as sr
import os
import json
import atexit

text_count = 0
fail_count = 0
skip_count = 0


def get_audio_text(audio_file, TRANSLATE_OPTION):
    txt = audio_file

    # use the audio file as the audio source
    r = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file) as source:
            audio = r.record(source)  # ERROR HERE
    except Exception as e:
        errStr = "File Read Error: " + str(e)
        print(errStr)
        return errStr

    if(TRANSLATE_OPTION == "s" or TRANSLATE_OPTION == "sphinx"):
        # recognize speech using Sphinx
        try:
            txt = r.recognize_sphinx(audio)
        except sr.UnknownValueError:
            txt = "Sphinx could not understand audio"
        except sr.RequestError as e:
            txt = "Sphinx error; {0}".format(e)

    elif(TRANSLATE_OPTION == "g" or TRANSLATE_OPTION == "google"):
        # recognize speech using Google Speech Recognition
        try:
            # for testing purposes, we're just using the default API key
            # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
            txt = r.recognize_google(audio)
        except sr.UnknownValueError:
            txt = "Google Speech Recognition could not understand audio"
        except sr.RequestError as e:
            txt = "Could not request results from Google Speech Recognition service; {0}".format(
                e)

    return txt


print(get_audio_text('test.mp3', 'g'))
