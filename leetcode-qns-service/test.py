import requests
import json
import time
import os
import queue
import pickle

LEET_CODE_URL = 'https://leetcode.com'
LEET_CODE_GRAPHQL_URL = 'https://leetcode.com/graphql' 

# get all the problems and take only the needed information
request = requests.get('/'.join([LEET_CODE_URL, 'api/problems/all/']))
data = json.loads(request.text)

# Creating queues for different difficulty levels
easy_questions = queue.Queue()
medium_questions = queue.Queue()
hard_questions = queue.Queue()

# Adding questions to respective queues
for question in data["stat_status_pairs"]:
    difficulty_level = question["difficulty"]["level"]
    title_slug = question["stat"]["question__title_slug"]
    
    if difficulty_level == 1:
        easy_questions.put(title_slug)
    elif difficulty_level == 2:
        medium_questions.put(title_slug)
    elif difficulty_level == 3:
        hard_questions.put(title_slug)

# Serialize and save the queues
# queue have locks for thread safety, convert to list as workaround
easy_questions_list = list(easy_questions.queue)
medium_questions_list = list(medium_questions.queue)
hard_questions_list = list(hard_questions.queue)

with open('Easy' + '.pkl', 'wb') as f:
    pickle.dump((easy_questions_list), f)

with open('Medium' + '.pkl', 'wb') as f:
    pickle.dump((medium_questions_list), f)

with open('Hard' + '.pkl', 'wb') as f:
    pickle.dump((hard_questions_list), f)

# Printing the questions based on difficulty levels
print("Difficulty Easy:")
print(easy_questions.qsize())

print("\nDifficulty Medium:")
print(medium_questions.qsize())


print("\nDifficulty Hard:")
print(hard_questions.qsize())

