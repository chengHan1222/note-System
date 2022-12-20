import cv2
import numpy as np
import pytesseract
from PIL import Image
import difflib

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

    pagetext = ["""敏捷式軟體開快速開發和交付成為大多數企業系統最關鍵的需求。
企業在時時變動的環境中營運，因此實際上不可能製作出一組完整、穩定的軟體需求。
先制訂完整需求之後，再設計、建構和測試系統的計畫驅動式軟體開發程序，不適合快速的軟體開發。
特別是商業系統，使用針對快速軟體開發和交付的開發程序是必要的。
不過這個觀念真正起飛是在1990年代晚期。
""", """敏捷式軟體開發快速軟體開發以敏捷式開發 (agile development) 或敏捷式方法 而聞名。
特點：
規格制訂、設計和實作這幾個程序是相互交錯的。
系統開發是一連串的增量模組 (increment)。終端使用者和其他的系統關係人都會參與指定和評估每個增量模組。
使用很多工具支援開發程序。
""", """敏捷式軟體開發敏捷式方法是一種增量式開發方法，每個增量模組都很小。
敏捷式方法將說明文件的數量儘量減少，使用非正式溝通取代有會議記錄的正式會議。
""", """計劃驅動式與敏捷式開發方法計劃驅動式方法
每個階段都有相關的輸出，階段的輸出會成為規劃後續程序活動的基礎
反覆迴圈是發生在活動內部
敏捷式方法
把設計和實作視為軟體程序的中心活動，將其他活動如需求抽取和測試納入設計和實作中
""", """敏捷式軟體開發實務上，計畫驅動式程序經常會搭配敏捷式程式設計一起使用，而敏捷式方法也會納入一些除了程式設計以外的有計畫的活動。
敏捷式程序不一定只注重編寫程式碼，它也可以生產一些設計說明文件。
""", """3.1  敏捷式方法因為對計畫驅動式繁重的軟體工程方式感到不滿意，因此在1990年代晚期發展出各種敏捷式方法。
這類方法的預期是要很快的交付可運作的軟體給客戶。
砍掉程序中的繁文縟節，避免把精力花在不確定有沒有長期價值的工作上
並刪除 ( 不製作 ) 那些可能永遠不會用到的說明文件。
""", """敏捷式方法的適用性敏捷式方法對於以下兩種類型的系統開發特別成功
對外販售的中小型軟體產品。現在幾乎所有的軟體產品和App都是以敏捷式方法開發而成。
機構內自行開發的訂做系統，因為用戶一定會支持和參與開發程序，也沒有一大堆外在的規則和規範來影響軟體。
敏捷式方法是針對小型而緊密整合的團隊，套用在大型系統上會產生一些問題
""", """極致程式設計(extreme programming, XP)  系統的每次發行間隔時間很短。
每兩週交付給客戶
極致程式設計在當時很有爭議，因為它引進的一些實務與那個時代的軟體開發文化大不相同。
""", """XP符合敏捷式方法的原則增量式交付：小型而頻繁的發行版本。
客戶參與：派駐某位客戶代表全時在開發團隊中工作。
是人員而不是程序：雙人組編碼(pair programming)，以及維持正常步調的開發程序 ( 不要常加班 ) 來達成。
擁抱改變：定期的系統發行。
維持簡單化：持續不斷的重構(refactoring)動作來改善程式碼品質。
""", """3.2.1  使用者故事客戶參與，指定系統需求並安排優先順序
依客戶需求討論出各種使用情境
每個使用者故事就是系統使用者可能會遇到的使用情境。
大家一起共同開發出扼要描述客戶需求 ( 也就是故事 ) 的「故事卡」(story card)。
"""]
    # 读取文件
    sum = 0
    for i in range(len(pagetext)):
        imagePath = f"testpic/{i+1}.png"
        img = cv2.imread(imagePath)
        scantext = pytesseract.image_to_string(img, lang='chi_tra+eng')
        percent = (difflib.SequenceMatcher(None, scantext, pagetext[i]).quick_ratio())
        sum += percent
        print(f"page{i}: {percent}")
    print("辨識度: "+str(sum/10))
