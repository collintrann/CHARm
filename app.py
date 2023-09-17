from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import time
import numpy as np
import pandas as pd
import json
import requests
from datetime import date, timedelta
import sentiment_analysis
from flask import Flask, request, jsonify
from flask_cors import cross_origin, CORS
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

headers = {"Authorization": f"Bearer {'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'}"}
API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"

# # date and time stuff
# today_date = date.today()
# date_monthAgo = today_date - timedelta(days = 30)
# date_3monthAgo = today_date - timedelta(days = 90)
# date_6monthAgo = today_date - timedelta(weeks = 26)
# date_1yearAgo = today_date - timedelta(weeks = 52)

# def split_dates(user_date_selection: str):
      
#     pass


#selenium organization

@app.route('/get_tweets', methods=['POST'])
@cross_origin()
def get_tweets():
    data = request.get_json()
    topic = data.get('topic')
    date = data.get('date')

    keywords = topic
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("webdriver.chrome.driver=/Users/rachellee/Downloads/chromedriver_mac64/chromedriver")
    driver = webdriver.Chrome(options = chrome_options)
    driver.execute_script("window.open('about:blank', '_blank');")
    driver.switch_to.window(driver.window_handles[-1])
    driver.get("https://twitter.com/")
    wait = WebDriverWait(driver, 10)

    login_button = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'a[data-testid="loginButton"]')))
    login_button.click()

    username = wait.until(EC.visibility_of_element_located((By.NAME, "text")))
    username.send_keys("hackcharmander")

    next_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//span[text()="Next"]')))
    next_button.click()

    password = wait.until(EC.visibility_of_element_located((By.NAME, "password")))
    password.send_keys("hackmit2023")
    login_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//span[text()="Log in"]')))
    login_button.click()

    explore_button = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'a[data-testid="AppTabBar_Explore_Link"]')))
    explore_button.click()

    search_input = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[data-testid="SearchBox_Search_Input"]')))
    search_input.send_keys(keywords)
    search_input.send_keys(Keys.RETURN)

    last_height = driver.execute_script("return document.body.scrollHeight")

    last_elem = ''
    current_elem = ''
    tweetlist = []

    timeline_div = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[aria-label="Timeline: Search timeline"]')))

    scroll_count = 1
    for _ in range(scroll_count):
        ActionChains(driver).send_keys(Keys.PAGE_DOWN).perform()
        time.sleep(2)
    child_divs = timeline_div.find_elements(By.TAG_NAME, 'div')
    print(type(child_divs))
    x = 0
    max_tweets = 100
    for tweet in child_divs:
        try:
            tweet_text_div = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-testid="tweetText"]')))
            tweet_text_spans = timeline_div.find_elements(By.TAG_NAME, 'span')
            for spans in tweet_text_spans:
                tweet_text = ' '.join([spans.text])
                tweetlist.append(tweet_text)
            x += 1
            if x >= max_tweets:
                break
        except Exception as e:
            print(f"Error extracting tweet: {str(e)}")
            continue
        if x >= max_tweets:
            break
    # print(tweetlist)
    non_special_pattern = re.compile(r'[^\W_]+')
    tweetlist = [tweet for tweet in tweetlist if (tweet.replace(" ", "") != "") and non_special_pattern.search(tweet)]
    print(tweetlist)
    
    sentiment_results = sentiment_analysis.get_sentiments(tweetlist)
    sentiment_analysis.get_bar_plot(sentiment_results[1])
    driver.quit()
    return jsonify(sentiment_results[1]), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
