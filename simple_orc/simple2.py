import cv2;
import numpy as np;

# NMS 方法（Non Maximum Suppression，非極大值抑制）
def nms(boxes, overlapThresh):
    if len(boxes) == 0:
        return []

    if boxes.dtype.kind == "i":
        boxes = boxes.astype("float")

    pick = []

    # 取四個座標陣列
    x1 = boxes[:, 0]
    y1 = boxes[:, 1]
    x2 = boxes[:, 2]
    y2 = boxes[:, 3]

    # 計算面積陣列
    area = (x2 - x1 + 1) * (y2 - y1 + 1)

    # 按得分排序（如沒有置信度得分，可按座標從小到大排序，如右下角座標）
    idxs = np.argsort(y2)

    # 開始遍歷，並刪除重複的框
    while len(idxs) > 0:
        # 將最右下方的框放入pick陣列
        last = len(idxs) - 1
        i = idxs[last]
        pick.append(i)

        # 找剩下的其餘框中最大座標和最小座標
        xx1 = np.maximum(x1[i], x1[idxs[:last]])
        yy1 = np.maximum(y1[i], y1[idxs[:last]])
        xx2 = np.minimum(x2[i], x2[idxs[:last]])
        yy2 = np.minimum(y2[i], y2[idxs[:last]])

        # 計算重疊面積佔對應框的比例，即 IoU
        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)
        overlap = (w * h) / area[idxs[:last]]

        # 如果 IoU 大於指定閾值，則刪除
        idxs = np.delete(idxs, np.concatenate(([last], np.where(overlap > overlapThresh)[0])))

    return boxes[pick].astype("int")

# 讀取圖片
imagePath = './p4ori.png'
img = cv2.imread(imagePath)

# 灰度化
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
vis = img.copy()
orig = img.copy()

# 呼叫 MSER 演算法
mser = cv2.MSER_create()
regions, boxes = mser.detectRegions(gray)  # 獲取文字區域
hulls = [cv2.convexHull(p.reshape(-1, 1, 2)) for p in regions]  # 繪製文字區域
cv2.polylines(img, hulls, 1, (0, 255, 0))
# cv2.imshow('img', img) #不規則

# 將不規則檢測框處理成矩形框
keep = []
for c in hulls:
    x, y, w, h = cv2.boundingRect(c)
    keep.append([x, y, x + w, y + h])
    cv2.rectangle(vis, (x, y), (x + w, y + h), (255, 255, 0), 1)



pick = nms(np.array(keep), overlapThresh=0.4)
for (startX, startY, endX, endY) in pick:
    cv2.rectangle(orig, (startX, startY), (endX, endY), (0, 0, 255), 1)

boxing_list = [img, vis, orig]
boxing = np.concatenate(boxing_list, axis=0)

cv2.imshow("hulls", boxing)
cv2.waitKey(0)


