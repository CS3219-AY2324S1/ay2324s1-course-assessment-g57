# PeerPrep

> Project: ay2324s1-course-assessment-g57 created by GitHub Classroom

<p align="center">
    <img src="Frontend/public/logo.png" alt="peerprep logo" width="500px" />
</p>
<p>
Peerprep is a collaborative platform for students to practice interview questions and receive feedback from their peers. It is a platform for students to learn from each other and improve their coding skills for potential interview questions.
</p>

# Assignment 4 Instructions

## Prerequisites

-  Docker installed

## Setup Instructions

1. Clone this branch
2. Run the commands in the following directories of the cloned repository


### Frontend
`cd Frontend`
`docker build -t peerprep-frontend .`
`docker run -p 3000:3000 peerprep-frontend`


### Question Service
`cd question-service`
`docker-compose up -d`

### User Service
`cd user-service`
`docker-compose up -d`
