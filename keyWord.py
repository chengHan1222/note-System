import jieba.analyse
jieba.initialize()
jieba.load_userdict("dict.txt")
jieba.analyse.set_stop_words("stopword.txt")


def findKeyword(text):

    d = text.replace(" ", "").replace("\n", "")

    return jieba.analyse.extract_tags(d, topK=20, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))


# if (__name__ == "__main__"):
#     jieba.initialize()
#     jieba.load_userdict("dict.txt")
#     jieba.analyse.set_stop_words("stopword.txt")

#     text = """3.3 敏捷 式 專案 管理

# 點 軟體 專案 經 理 必 須知 道 目前 的 情況 專案 是 否 能 達成 目標 ,
# 在 規劃 的 時 程 和 預算 範圍 內 準時 交付 軟體 。
# 點 專案 經 理 負責 提出 專案 計 畫 , 內 容 包含 應 該 交付 什麼 功能 、
# 何時 交付 , 以 及 會 有 哪些 人 負責 開 發 此 專案 。
# 點 敏捷 式 專案 管理 Serum 一 共有 三 個 階段
# 大 網 規劃 : 建立 該 專案 的 總 體 目 標 和 設計 軟體 架構
# 衝刺 (sprint2 循 環 : 每 個 週期 開 發 系 統 的 增 量
# 專案 結案 ; 完 成 所 需 的 文 件 。 如 使用 者 手冊 以 及 評估 從 專案
# 吸取 的 經 驗 教訓

# 念 、 六 圖 書 公司 版 權 所 有

# """
#     d = text.replace(" ", "").replace("\n", "")
#     print(d)

#     tag = jieba.analyse.extract_tags(d, topK=20, withWeight=False)
#     print(", ".join(tag))