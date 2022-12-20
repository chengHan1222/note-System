import cv2
import numpy as np
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"


def changeImage(file):
    pil_image = Image.open(file)
    img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    height, width = img.shape[:2]
    if (height > width):
        dim_size = (int(width * 900 / height), 900)
    else:
        dim_size = (900, int(height * 900 / width))
    img = cv2.resize(img, dim_size, interpolation=cv2.INTER_AREA)


    # 提升對比度
    alpha = 1.7
    beta = 0
    adjusted = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

    # 轉化成灰度圖
    gray = cv2.cvtColor(adjusted, cv2.COLOR_BGR2GRAY)

    adaptive_threshold = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 85, 11)

    # kernel = np.ones((5, 5), np.uint8)

    # # 膨脹一次，讓輪廓突出
    # dilation = cv2.dilate(gray, kernel, iterations=1)

    # # 腐蝕一次，去掉細節
    # erosion = cv2.erode(dilation, kernel, iterations=1)

    # # 再次膨脹，讓輪廓明顯一些
    # dilation2 = cv2.dilate(erosion, kernel, iterations=2)

    # # 圖片二值化
    # ret, binary = cv2.threshold(dilation2, 250, 255, cv2.THRESH_BINARY)

    # cv2.imshow("img", adaptive_threshold)
    # cv2.waitKey(0)

    return adaptive_threshold


def split_image(file):
    pil_image = Image.open(file)
    img = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

    # 轉化成灰度圖
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 利用Sobel邊緣檢測生成二值圖
    sobel = cv2.Sobel(gray, cv2.CV_8U, 1, 0, ksize=3)
    # 二值化
    ret, binary = cv2.threshold(
        sobel, 0, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY)

    # 膨脹、腐蝕
    element1 = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 9))
    element2 = cv2.getStructuringElement(cv2.MORPH_RECT, (24, 6))

    # 膨脹一次，讓輪廓突出
    dilation = cv2.dilate(binary, element2, iterations=1)

    # 腐蝕一次，去掉細節
    erosion = cv2.erode(dilation, element1, iterations=1)

    # 再次膨脹，讓輪廓明顯一些
    dilation2 = cv2.dilate(erosion, element2, iterations=2)

    #  查詢輪廓和篩選文字區域
    imgArray = []

    contours, hierarchy = cv2.findContours(
        dilation2, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    for i in range(len(contours)):
        cnt = contours[len(contours)-i-1]

        # 計算輪廓面積，並篩選掉面積小的
        area = cv2.contourArea(cnt)
        if (area < 1000):
            continue

        # 找到最小的矩形
        rect = cv2.minAreaRect(cnt)

        # box是四個點的座標
        box = cv2.boxPoints(rect)
        box = np.int0(box)

        box[0][1] = np.maximum(box[0][1], 0)
        box[2][1] = np.minimum(box[2][1], img.shape[0])
        box[0][0] = np.maximum(box[0][0], 0)
        box[2][0] = np.minimum(box[2][0], img.shape[1])

        # 計算高和寬
        height = abs(box[0][1] - box[2][1])
        width = abs(box[0][0] - box[2][0])

        # 根據文字特徵，篩選那些太細的矩形，留下扁的
        if (height > width * 1.3):
            continue

        cv2.drawContours(img, [box], 0, (0, 255, 0), 1)
        imgArray.append(gray[box[0][1]:box[2][1], box[0][0]:box[2][0]])

    return imgArray


def image_to_text(imgArray):
    result_content = ""
    for img in imgArray:
        try:
            text = pytesseract.image_to_string(img, lang='chi_tra+eng')
            result_content += text
        except:
            result_content += '\n'
            print('error')
    return result_content


def image_to_text_old(file):
    image = changeImage(file)
    text = pytesseract.image_to_string(image, lang="qq66+chi_tra")
    print(text)
    return text


# =============================================================================


def process(gray):
    # 1. Sobel算子，x方向求梯度
    sobel = cv2.Sobel(gray, cv2.CV_8U, 1, 0, ksize = 3)
    # 2. 二值化
    ret, binary = cv2.threshold(sobel, 0, 255, cv2.THRESH_OTSU+cv2.THRESH_BINARY)
 
    # 3. 膨胀和腐蚀操作的核函数
    element1 = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 9))
    element2 = cv2.getStructuringElement(cv2.MORPH_RECT, (24, 6))
 
    # 4. 膨胀一次，让轮廓突出
    dilation = cv2.dilate(binary, element2, iterations = 1)
 
    # 5. 腐蚀一次，去掉细节，如表格线等。注意这里去掉的是竖直的线
    erosion = cv2.erode(dilation, element1, iterations = 1)
 
    # 6. 再次膨胀，让轮廓明显一些
    dilation2 = cv2.dilate(erosion, element2, iterations = 3)

    return dilation2
    

def textRecognition(img):

    region = []
    # 1. 查找轮廓
    contours, hierarchy = cv2.findContours(img, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
 
    # 2. 筛选那些面积小的
    for i in range(len(contours)):
        cnt = contours[len(contours)-i-1]
        # 计算该轮廓的面积
        area = cv2.contourArea(cnt) 
 
        # 面积小的都筛选掉
        if(area < 1000):
            continue
 
        # 轮廓近似，作用很小
        epsilon = 0.001 * cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, epsilon, True)
 
        # 找到最小的矩形，该矩形可能有方向
        rect = cv2.minAreaRect(cnt)
        # print("rect is: ")
        # print(rect)
 
        # box是四个点的坐标
        box = cv2.boxPoints(rect)
        box = np.int0(box)
 
        box[0][1] = np.maximum(box[0][1], 0)
        box[2][1] = np.minimum(box[2][1], img.shape[0])
        box[0][0] = np.maximum(box[0][0], 0)
        box[2][0] = np.minimum(box[2][0], img.shape[1])

        # 计算高和宽
        height = abs(box[0][1] - box[2][1])
        width = abs(box[0][0] - box[2][0])
 
        # 筛选那些太细的矩形，留下扁的
        if(height > width * 1.2):
            continue

        region.append(box)
 
    return region
 
 
def detect(img):
    # 1.  转化成灰度图
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
 
    # 2. 形态学变换的预处理，得到可以查找矩形的图片
    dilation = process(gray)

    # 3. 查找和筛选文字区域
    region = textRecognition(dilation)
 
    text = ""
    # 4. 用绿线画出这些找到的轮廓
    for box in region:
        if (box[0][1] < box[2][1] and box[0][0] < box[2][0]):
            cv2.drawContours(gray, [box], 0, (0, 255, 0), 1)
            scan = pytesseract.image_to_string(gray[box[0][1]:box[2][1], box[0][0]:box[2][0]], lang='chi_tra+eng')
            text += scan

    # cv2.namedWindow("img", cv2.WINDOW_NORMAL)
    # cv2.imshow("img", gray)
    # cv2.waitKey(0)
    return text


if __name__ == '__main__':

    text = """敏捷式軟體開發快速軟體開發以敏捷式開發 (agile development) 或敏捷式方法 而聞名。特點：
規格制訂、設計和實作這幾個程序是相互交錯的。
系統開發是一連串的增量模組 (increment)。終端使用者和其他的系統關係人都會參與指定和評估每個增量模組。
使用很多工具支援開發程序。
"""
    # 读取文件
    imagePath = "test3.png"
    img = cv2.imread(imagePath)
    scantext = pytesseract.image_to_string(img, lang='chi_tra+eng')
    # for i in range(len(text)):
    #     if (text[i] == scantext[i]):
    #         same += 1
    import difflib
    print(difflib.SequenceMatcher(None, scantext, text).quick_ratio())
    # print(scantext)
    # print(same/len(text))