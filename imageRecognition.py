import cv2
import numpy as np
import pytesseract
from PIL import Image
import difflib

pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"


def changeImage(file):
    # pil_image = Image.open(file)
    img = cv2.cvtColor(file, cv2.COLOR_RGB2BGR)
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

    # adaptive_threshold = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 85, 11)

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

    return gray


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

    pagetext = [
"""敏捷式軟體發
開快速開發和交付成為大多數企業系統最關鍵的需求。
企業在時時變動的環境中營運，因此實際上不可能製作出
一組完整、穩定的軟體需求。
先制訂完整需求之後，再設計、建構和測試系統的計畫驅動
式軟體開發程序，不適合快速的軟體開發。
特別是商業系統，使用針對快速軟體開發和交付的開發程序
是必要的。
不過這個觀念真正起飛是在1990年代晚期。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""敏捷式軟體開發
快速軟體開發以敏捷式開發 (agile development) 或敏捷式方法
而聞名。
特點：
1.規格制訂、設計和實作這幾個程序是相互交錯的。
2.系統開發是一連串的增量模組 (increment)。終端使用者和
其他的系統關係人都會參與指定和評估每個增量模組。
3.使用很多工具支援開發程序。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""敏捷式軟體開發
敏捷式方法是一種增量式開發方法，每個增量模組都很小。
敏捷式方法將說明文件的數量儘量減少，使用非正式溝通取
代有會議記錄的正式會議。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""計劃驅動式與敏捷式開發方法
計劃驅動式方法
每個階段都有相關的輸出，階段的輸出會成為規劃後續程
序活動的基礎
反覆迴圈是發生在活動內部
敏捷式方法
把設計和實作視為軟體程序的中心活動，將其他活動如需
求抽取和測試納入設計和實作中
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""敏捷式軟體開發
實務上，計畫驅動式程序經常會搭配敏捷式程式設計一起使
用，而敏捷式方法也會納入一些除了程式設計以外的有計畫
的活動。
敏捷式程序不一定只注重編寫程式碼，它也可以生產一些設
計說明文件。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.1  敏捷式方法
因為對計畫驅動式繁重的軟體工程方式感到不滿意，因此在
1990年代晚期發展出各種敏捷式方法。
這類方法的預期是要很快的交付可運作的軟體給客戶。
砍掉程序中的繁文縟節，避免把精力花在不確定有沒有長期
價值的工作上
並刪除 ( 不製作 ) 那些可能永遠不會用到的說明文件。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""敏捷式方法的適用性
敏捷式方法對於以下兩種類型的系統開發特別成功
1.對外販售的中小型軟體產品。現在幾乎所有的軟體產品和
App都是以敏捷式方法開發而成。
2.機構內自行開發的訂做系統，因為用戶一定會支持和參與
開發程序，也沒有一大堆外在的規則和規範來影響軟體。
敏捷式方法是針對小型而緊密整合的團隊，套用在大型系統
上會產生一些問題
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""極致程式設計(extreme programming, XP)  
系統的每次發行間隔時間很短。
每兩週交付給客戶
極致程式設計在當時很有爭議，因為它引進的一些實務與那
個時代的軟體開發文化大不相同。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""XP符合敏捷式方法的原則
1.增量式交付：小型而頻繁的發行版本。
2.客戶參與：派駐某位客戶代表全時在開發團隊中工作。
3.是人員而不是程序：雙人組編碼(pair programming)，以及
維持正常步調的開發程序 ( 不要常加班 ) 來達成。
4.擁抱改變：定期的系統發行。
5.維持簡單化：持續不斷的重構(refactoring)動作來改善程式
碼品質。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.2.1  使用者故事
客戶參與，指定系統需求並安排優先順序
依客戶需求討論出各種使用情境
每個使用者故事就是系統使用者可能會遇到的使用情境。
大家一起共同開發出扼要描述客戶需求 ( 也就是故事 ) 的「故
事卡」(story card)。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""故事撰寫準則
理想上，故事彼此獨立。 
不總是可行的，但應該盡可能，以便可以按任何順序開發
故事的細節由客戶和開發人員協商。
但是太多細節模糊故事的含義。 
註釋故事的最佳方法之一是為故事編寫測試案例。 
編寫故事應彰顯其對用戶或客戶的價值。 
實現這一目標的最佳方法是讓客戶撰寫故事。
如果故事太大，複合和復雜的故事可被分成多個較小的故事。
 如果它們太小，可以將多個小故事組合成一個更大的故事。
故事必需是可測試的。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""故事卡練習作業
身為一個<角色>，我想要<做某些事>，讓我可以<得到某種
價值/完成某種目標>
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.2.2  重構
傳統軟體工程的基本原則之一，就是其設計要能適應將來的
變更。
極致程式設計認為替將來的變更進行設計只是浪費精神而已，
不值得花時間為程式加上適應變更的特性。
XP建議正在開發中的程式碼，應該要持續不斷的重構。
程式設計團隊要尋找軟體可能改善的地方，然後立刻實作
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.2.2  重構
重構會改善軟體結構和易讀性，因此可避免當軟體被修改時
會發生的結構惡化現象。
例子包括重新組織類別的階層架構而移除重複的程式碼、
把屬性和方法進行整理和重新命名等。
原則上，如果能讓重構成為開發程序的一部分，軟體應該就
會一直很容易被理解，而且也容易隨著新需求的提出而變更。
但實際上情況不一定都是如此。
此外，有些新功能和變更不適合進行程式碼層級的重構，而
是需要修改系統架構。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.2.3  測試優先的開發方式
XP中的測試有以下幾個重要特色：
1.測試優先 (test-first) 的開發方式
2.以增量方式從情境來開發測試案例
3.請使用者參與測試的開發與確認
4.使用自動化的測試架構
演進成更廣泛的測試驅動式(test-driven)開發方式
不是先編寫程式碼，再針對這些程式碼撰寫測試案例，而
是在寫程式碼之前先寫測試案例。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""客戶參與測試
對將在下一版本的系統實作的”故事”，客戶協助進行驗收
測試
隨著開發進行，參與的客戶編寫測試。因此，得以確保所有
的新程式碼是顧客需要的
然而,客戶擁有的時間有限，因此無法全程參與開發團隊。他
們可能會覺得提供的需求已有貢獻，不願涉及在測試過程
Copyright Pearson Education 
Chapter 3 Agile software development 36
高立圖書公司版權所有
""", 
"""測試自動化
在實作前，將測試寫成可執行元件
這些測試元件應
獨立
模擬提交待測試的輸入
檢查結果符合輸出規格 
一自動化測試框架（如Junit)可以很容易地編寫可執行測試
有一整組可以快速輕鬆地執行的測試集合
每當任何功能被添加到系統時，可以執行這些測試，立即
捕獲新程式碼引入的問題.  
Copyright Pearson Education 
Chapter 3 Agile software development 37
高立圖書公司版權所有
""", 
"""XP 測試的困境
幾個問題：
1.程式設計人員大多喜歡程式設計勝於測試，因此有時在撰
寫測試案例時會走捷徑。
2.某些測試很難以遞增方式來撰寫。
例如在複雜的使用者介面中，就很難寫出能測試各個畫
面間的「顯示邏輯」和工作流程的單元測試。
3.很難判斷一組測試案例的完整性。
即使有一大堆測試案例，但是可能涵蓋範圍不完整，而
導致系統的重要部分仍然沒測試到。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.2.4  雙人組程式撰寫
坐在一起，在同一台電腦前面一起開發軟體，這稱為雙人組
程式撰寫 (pair programming)。
配對是動態建立的，所以在開發程序期間所有的團隊成員都
可能一起搭配工作。
也許你會認為雙人組程式撰寫的生產力會比較低，研究發現
比起分別作業，雙人組反而會大大降低生產力。
在雙人組程式撰寫期間能夠彼此分享知識是很重要的，因為
這能降低有成員離開團隊時專案的整體風險。
等於是一次非正式的審查動作，因為每行程式碼至少都有兩
個人看過。
Copyright Pearson Education 高立圖書公司版權所有
""", 
"""3.3  敏捷式專案管理
軟體專案經理必須知道目前的情況，專案是否能達成目標，
在規劃的時程和預算範圍內準時交付軟體。
專案經理負責提出專案計畫，內容包含應該交付什麼功能、
何時交付，以及會有哪些人負責開發此專案。
敏捷式專案管理Scrum一共有三個階段
大綱規劃: 建立該專案的總體目標和設計軟體架構
衝刺(sprint)循環:每個週期開發系統的增量
專案結案:完成所需的文件，如使用者手冊以及評估從專案
吸取的經驗教訓
Copyright Pearson Education 高立圖書公司版權所有
"""]
    # 读取文件
    sum = 0
    for i in range(len(pagetext)):
        imagePath = f"testpic/{i}.png"
        img = cv2.imread(imagePath)
        img=changeImage(img)
        scantext = pytesseract.image_to_string(img, lang='chi_tra+eng')
        print(scantext)
        percent = (difflib.SequenceMatcher(None, scantext, pagetext[i]).quick_ratio())
        sum += percent
        print(f"page{i}: {percent}")
    print("預處理圖片後辨識度: "+str(sum/10))
