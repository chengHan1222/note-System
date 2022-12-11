import jieba.analyse
jieba.initialize()
jieba.load_userdict("dict.txt")
jieba.analyse.set_stop_words("stopword.txt")


def findKeyword(text):

    return jieba.analyse.extract_tags(text, topK=20, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))


# if (__name__ == "__main__"):

#     jieba.load_userdict("dict.txt")
#     jieba.analyse.set_stop_words("stopword.txt")

#     text = """敏捷開發是什麼？與瀑布式開發有何差異？
# 敏捷開發（Agile Development）是於 1990 年代異軍突起的一種新型態軟體開發方法，可建立較短的開發循環，以漸進式的方式開發產品。換言之，就是將大型專案切分為較小的產品功能，隨著專案的進行逐步依據用戶及市場的反應修正產品路線。可因應商業環境與市場需求的變化，快速進行調整，是敏捷式開發最主要的核心價值。

# 相較之下，早期常用的軟體開發方法－瀑布式開發（Waterfall Development），較注重線型開發流程，從蒐集需求、產品設計、程式編寫、軟體測試到產品交付，要求一開始便將產品規格與細節都規劃清楚後才能進入開發流程。等到產品發佈才能驗證市場反應，一旦市場反應不佳或需求已改變，或是發現錯誤需要修正，都可能導致產品必須砍掉重練。

# 最常見的敏捷開發流程架構
# 敏捷開發是軟體開發的精神，而 Scrum 則是實現敏捷開發的其中一種方法，也是敏捷開發中最被廣泛使用的框架，以增量迭代式的軟體開發流程，重視高靈活性與彈性，可隨時視市場與用戶需求調整產品走向。在敏捷開發過程中，可基於前一次的交付成果重複反饋，透過頻繁的增量交付，使軟體接近並達到想要的目標。

# Scrum 雖然起初最常被使用在軟體開發上，但其原則和概念也適用於商業開發、市場研究、行銷策略等各種領域。Scrum 講求能快速從經驗中學習反應，以及團隊的自我管理，運用該流程，可使團隊獲得高效率的工作成果，也因而使得 Scrum 成為近年來相當熱門的敏捷開發方式。
# """
#     d = text.replace('!', '').replace('／', "").replace('《', '').replace('》', '').replace('，', '').replace('。', '').replace('「', '').replace('」', '').replace('（', '').replace('）', '').replace('！', '').replace('？', '').replace('、', '').replace('▲', '').replace('…', '').replace('：', '')

#     tag = jieba.analyse.extract_tags(d, topK=20, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))
#     print(", ".join(tag))