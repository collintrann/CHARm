import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
import json
import requests

#all api stuff, maybe switch out developer with someone else once we hit ceiling
headers = {"Authorization": f"Bearer {'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'}"}
API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"

# huggingface analysis func
def query(payload):
    data = json.dumps(payload)
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return json.loads(response.content.decode("utf-8")) ## replace with return later

# returns the positive score as a float
def get_positive_score(data) -> float:
    positive = None
    try:
        if data[0][0]['label'] == 'POSITIVE':
            positive = data[0][0]['score']
        else:
            positive = data[0][1]['score']
        return positive
    except:
        pass

# runs sentiment analysis on list of strings and returns a float list of sentiment scores
def get_sentiments(tweetlist):
    scores = []
    num_positive = 0
    num_negative = 0
    max_score = 0
    min_score = 1
    most_positive_tweet = ""
    most_negative_tweet = ""
    for tweet in tweetlist:
        data = query({"inputs": tweet})
        score = get_positive_score(data)
        if score is None:
            continue
        if type(score) != int and type(score) != float:
            continue
        print(score)
        if score >= 0.5:
            scores.append({score: "POSITIVE"})
            num_positive += 1
        else:
            scores.append({score: "NEGATIVE"})
            num_negative += 1
        if score > max_score:
            max_score = score
            most_positive_tweet = tweet
        if score < min_score:
            min_score = score
            most_negative_tweet = tweet
    #ratio = num_positive / num_negative
    #sentiment = (scores, ratio, most_positive_tweet, most_negative_tweet)
    sentiment = (scores, {"POSITIVES": num_positive, "NEGATIVES": num_negative, "MOST_POS_TWEET": most_positive_tweet, "MOST_NEG_TWEET": most_negative_tweet}, most_positive_tweet, most_negative_tweet)
    print(sentiment[1])
    return sentiment

def generate_bar_plot(data: dict): 
    # If we have time to figure out how
    # to search tweets by date input will be list of ratios
    # and generate histogram instead of bar plot
    positive_or_negative = list(data.keys())
    values = list(data.values())
  
    #graph = plt.figure(figsize = (10, 5))
    
    # creating the bar plot
    plt.bar(positive_or_negative, values, width = 0.4)
    plt.title("Number of positive and negative sentiment tweets")
    plt.savefig('plot.png', transparent=True)
    plt.show() # DELETE LATER

def generate_histogram(data: list[float], keyword, time_in_months: int):
    plt.hist(data)
    plt.title(f"Sentiment around {keyword} over the past {time_in_months} months")
    plt.show()

def generate_bar_chart(data:list[dict], keyword, time_in_months: int):
    # DATA IS LIST OF DICTS OF LENGTH 2 (containing positive and negative count)
    barWidth = 0.3
    positives = [x["POSITIVES"] for x in data]
    negatives = [x["NEGATIVES"] for x in data]
    positive_percentages = [((positive / (len(positives) + len(negatives))) * 100) for positive in positives]
    negative_percentages = [(100 - positive_percentages[i]) for i in range(len(positive_percentages))]
    bar1 = np.arange(len(positives))
    bar2 = [x + barWidth for x in bar1]
    plt.bar(bar1, negative_percentages, color = 'r', width = barWidth, label = "Percent Negative")
    plt.bar(bar2, positive_percentages, color = 'b', width = barWidth, label = "Percent Positive")
    plt.title(f"Sentiment around {keyword} over the past {time_in_months} months")
    plt.xlabel("Positive and Negative Tweets\n\nINSERT MOST POSITIVE TWEET HERE\n\nINSERT MOST NEGATIVE TWEET HERE")
    plt.ylabel("Percent")
    plt.legend()
    #plot.xticks([x + barWidth for x in range(len(positive_percentages))], [LIST OF DATES])
    plt.savefig('plot.png', transparent=True)
    plt.show() # REMOVE THIS LATER
