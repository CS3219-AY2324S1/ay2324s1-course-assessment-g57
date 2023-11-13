import pickle
import requests
import json
import queue
import os
import random
from google.cloud import logging

#to run locally remove google.cloud logger and use default logger as google auth is required

logging_client = logging.Client()
log_name = "google_logs"
google_logger = logging_client.logger(log_name)

LEET_CODE_URL = 'https://leetcode.com'
LEET_CODE_GRAPHQL_URL = 'https://leetcode.com/graphql' 

# get all the problems and take only the needed information
request = requests.get('/'.join([LEET_CODE_URL, 'api/problems/all/']))
data = json.loads(request.text)

# Creating queues for different difficulty levels
easy_questions = list()
medium_questions = list()
hard_questions = list()

# Adding questions to respective queues
for question in data["stat_status_pairs"]:
    difficulty_level = question["difficulty"]["level"]
    title_slug = question["stat"]["question__title_slug"]
    
    if difficulty_level == 1:
        easy_questions.append(title_slug)
    elif difficulty_level == 2:
        medium_questions.append(title_slug)
    elif difficulty_level == 3:
        hard_questions.append(title_slug)

random.shuffle(easy_questions)
random.shuffle(medium_questions)
random.shuffle(hard_questions)

class Question:
    def __init__(self, question_title, difficulty, content, category, link):
        self.questionTitle = question_title
        self.difficulty = difficulty
        self.content = content
        self.category = category
        self.link = link

    def __str__(self):
        return f"Question Title: {self.questionTitle}\nDifficulty: {self.difficulty}\nContent: {self.content}\nCategory: {self.category}"


HEX_LIKE_URL_1 = '''https://leetcode.com/graphql?operationName=questionData&variables={%22titleSlug%22:%22''' 
HEX_LIKE_URL_2 = '''%22}&query=query%20questionData($titleSlug:%20String!)%20{%20%20%20%20%20question(titleSlug:%20$titleSlug)%20{%20%20%20%20%20%20%20%20%20titleSlug%20%20%20%20%20%20%20%20%20content%20%20%20%20%20categoryTitle%20%20%20%20%20}%20}'''
HEX_LIKE_URL_3 = '''https://leetcode.com/graphql?operationName=singleQuestionTopicTags&variables={%22titleSlug%22:%22'''
HEX_LIKE_URL_4 = '''%22}&query=query%20singleQuestionTopicTags%20(%24titleSlug%3A%20String!)%20%7B%0A%20%20%20%20question(titleSlug%3A%20%24titleSlug)%20%7B%0A%20%20%20%20%20%20topicTags%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D'''

# Configure logging to write output to a log file
#logging.basicConfig(filename='output.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def post_question_to_database(question_object, google_logger):
    endpoint_url = "https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/questions"  # Replace with your API endpoint URL
    headers = {
        "Content-Type": "application/json"
    }

    # Convert Question object to JSON
    question_json = {
        "title": question_object.questionTitle,
        "complexity": question_object.difficulty,
        "description": question_object.content,
        "categories": question_object.category,
        "link": question_object.link,
    }

    try:
        response = requests.post(endpoint_url, json=question_json, headers=headers)

        if response.status_code == 201:
            #logging.info("Question added successfully to the database!")
            google_logger.log_text(question_object.questionTitle + " Question added successfully to the database!")
            #print("Question added successfully to the database!")
        else:
            #logging.error(f"Failed to add question to the database. Status code: {response.status_code}")
            google_logger.log_text(f"Failed to add {question_object.questionTitle} to the database. Status code: {response.status_code}")
            #print("Failed to add question to the database. Status code:", response.status_code)

    except Exception as e:
        #logging.error(f"Error occurred while sending POST request: {str(e)}")
        google_logger.log_text(f"Error occurred while sending POST request: {str(e)}")
        #print("Error occurred while sending POST request:", str(e))

#retrieved all free questions from leetcode
def fetch_and_process_questions(question_list, difficulty, goggle_logger):
    
    for i in range(30):
    
        qnsTitle = question_list[i]

        res = requests.get(HEX_LIKE_URL_1 + qnsTitle + HEX_LIKE_URL_2)
        d = json.loads(res.text)

        if 'data' in d and 'question' in d['data']:
            question_data = d['data']['question']
            title = qnsTitle
            content = question_data.get('content')
            
            if content == None:
                continue
            else:
                res2 = requests.get(HEX_LIKE_URL_3 + qnsTitle + HEX_LIKE_URL_4)
                e = json.loads(res2.text)
                #print(e)
                if 'data' in e and 'question' in e['data']:
                    question_data = e['data']['question']
                    topicTags = question_data.get('topicTags')
                    topic_names = [tag['name'] for tag in topicTags]  # Extracting only 'name' from topicTags
                    question_object = Question(title, difficulty.lower(), content, topic_names, "https://leetcode.com/problems/" + qnsTitle)
                    post_question_to_database(question_object, google_logger)
        else:
            print(f"Error: Unable to retrieve {difficulty} question data for titleSlug: {qnsTitle}")

# Fetch and process questions for easy, medium, and hard difficulties
fetch_and_process_questions(easy_questions, "Easy", google_logger)

fetch_and_process_questions(medium_questions, "Medium", google_logger),

fetch_and_process_questions(hard_questions, "Hard", google_logger)

