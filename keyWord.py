import jieba.analyse

def findKeyword(text):
    return jieba.analyse.textrank(text, withWeight=True)
