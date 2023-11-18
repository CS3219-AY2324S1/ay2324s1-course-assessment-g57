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


# Assignment 5 Instructions

Assignment 5 involves almost the entire app. We recommend using a partially hosted version of the app as it invovles less setup. The following services of the app are required for assignment 5:

- User service (hosted)
- Question service (hosted)
- Collab service (local)
- Matching service (local)
- Frontend service (local)

The user and question services are hosted on AWS so you only need to set up the collab, matching and frontend services locally.


## Prerequisites

-   NodeJS version >v20
-   In the Frontend directory, make a copy of `.env.sample` and name it `.env`. The `.env` file contains the environment variables required for the services to run. Ideally, the `.env` file should not be committed to the repository as it contains sensitive information. We have not committed the `.env` file, but instead have left the environment variables in the `.env.sample` file for your convenience.


## Setup Instructions

1. Clone this branch
2. Install the dependencies for each service by running `yarn install` in the respective service folders for collab, matching and frontend services.

3. Open separate terminals for each service and run the following commands:
    - Collab service: `npm start`
    - Matching service:
        ```
        docker build -t matching-service .
        docker-compose build
        ```

        ```
        docker run -p 4000:4000 -p 5672:5672 -d matching-service
        docker-compose up
        ```

    - Frontend: `yarn build` followed by `yarn start`


## Testing Instructions

- Open a browser and navigate to `localhost:3000` to access the app.
- Create an account and login to access the matching service.
