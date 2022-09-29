from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

def image_to_text(file):
    image = Image.open(file)
    text = pytesseract.image_to_string(image, lang='chi_tra+eng')
    return text
