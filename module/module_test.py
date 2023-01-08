import unittest

from imageRecognition import image_to_text_old
from record import get_text as get_record_text
from keyWord import find_keyword

class image_recognition_testcase(unittest.TestCase):
    # img width > height
    def test_image_recognition_img1(self):
        file = f"testpicwithzz/0.png"

        expected = type('影像測試')
        result = image_to_text_old(file)
        self.assertEqual(expected, type(result))
    # img width < height
    def test_image_recognition_img2(self):
        file = f"testpicwithzz/test1.jpeg"

        expected = type('影像測試')
        result = image_to_text_old(file)
        self.assertEqual(expected, type(result))

class speech_recognition_testcase(unittest.TestCase):
    def test_speech_recognition(self):
        file = f"testVideo/test1.wav"

        expected = type('錄音測試')
        result = get_record_text(file)
        self.assertEqual(expected, type(result))
    
    def test_speech_recognition_fail(self):
        file = f"testVideo/RRRRR.wav"

        expected = "無法翻譯"
        result = get_record_text(file)
        self.assertEqual(expected, result)

class keyword_testcase(unittest.TestCase): 
    def test_keyword(self):
        expected = type(['軟體工程'])
        result = find_keyword('軟體工程')
        self.assertEqual(expected, type(result))
        
suite = unittest.TestSuite()
suite.addTest(unittest.TestLoader().loadTestsFromTestCase(image_recognition_testcase))
suite.addTest(unittest.TestLoader().loadTestsFromTestCase(speech_recognition_testcase))
suite.addTest(unittest.TestLoader().loadTestsFromTestCase(keyword_testcase))

unittest.TextTestRunner(verbosity=2).run(suite)