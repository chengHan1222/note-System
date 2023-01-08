import jieba.analyse
jieba.initialize()
jieba.load_userdict("dict.txt")
jieba.analyse.set_stop_words("stopword.txt")

def find_keyword(text):
    d = text.replace(" ", "").replace("\n", "")
    return jieba.analyse.extract_tags(d, topK=20, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v'))


        
