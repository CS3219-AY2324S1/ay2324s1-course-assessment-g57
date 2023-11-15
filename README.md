# PeerPrep

> Project: ay2324s1-course-assessment-g57 created by GitHub Classroom

<p align="center">
    <img src="Frontend/public/logo.png" alt="peerprep logo" width="500px" />
</p>
<p>
Peerprep is a collaborative platform for students to practice interview questions and receive feedback from their peers. It is a platform for students to learn from each other and improve their coding skills for potential interview questions.
</p>

<p>
<b>Quick Links:</b>

-   [Services](#services)
-   [Setup](#setup) - [PeerPrep](#peerprep-setup) - [Assignment 1](#assignment-1) - [Assignment 2](#assignment-2) - [Assignment 3](#assignment-3) - [Assignment 4](#assignment-4) - [Assignment 5](#assignment-5) - [Assignment 6](#assignment-6)
</p>

## Services

### Frontend

Provides the user interface for the application, users will interact with the various services through the Frontend. Main hub for interaction between different services.

### matching-service

Provides the matching algorithm for the application, which will match users based on the question difficulty level selected.

### question-service

Provides the questions for the application.

### user-service

Handles user authentication and authorization.

### video-service

Handles the video conferencing between users.

### collab-service

Handles the signaling between users.

## Setup

### PeerPrep Setup

To set up the entire application locally, follow the instructions on the various READMEs in the respective folders.

### Assignment 1

### Assignment 2

### Assignment 3

### Assignment 4



### Assignment 5

#### Setup Matching Service

Switch to the **`assignment-5`** branch of this repo and ensure your current working directory is the `matching-service` folder.

```
npm install
```

This project uses NodeJS version v18.16.1.

#### Run Matching Service with Docker

Switch to the **`assignment-5`** branch of this repo and ensure your current working directory is the `matching-service` folder.

```
docker build -t matching-service .
docker-compose build
```

```
docker run -p 4000:4000 -p 5672:5672 -d matching-service
docker-compose up
```


#### Test Matching Service

There are 2 options to test the matching service:
1. Use the included `index.html` page within the `matching-service` folder. It provides a basic UI that showcases the matching functionality.

    - Once the matching service is running, navigate to `localhost:4000`.


2. Setup the entire PeerPrep application on your local machine and access the matching service from the frontend service. Specifically, you will need to start the following services to run PeerPrep:

    - User service
    - Question service
    - Collab service
    - Frontend service
    - Matching service
    - Video service (optional for testing matching service)

    Follow the README instructions in the respective folders to setup the services locally.



### Assignment 6

Leetcode question service on GCP Cloud Run. Click [here](https://github.com/CS3219-AY2324S1/ay2324s1-assignment-6-g57) for more details.
