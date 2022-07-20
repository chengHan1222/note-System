from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

def image_to_text():
    filePath = "王俊傑.png"
    image = Image.open(filePath)
    text = pytesseract.image_to_string(image, lang='chi_tra+eng')
    return text

print(image_to_text())