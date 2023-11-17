# PeerPrep

> Project: ay2324s1-course-assessment-g57 created by GitHub Classroom

<p align="center">
    <img src="Frontend/public/logo.png" alt="peerprep logo" width="500px" />
</p>
<p>
Peerprep is a collaborative platform for students to practice interview questions and receive feedback from their peers. It is a platform for students to learn from each other and improve their coding skills for potential interview questions.
</p>

# Assignment 2 Instructions

## Services

### Frontend

Create a .env file in the root directory of the Frontend folder. Refer to .env.sample for the environment variables required for the frontend to run.

### Question Service

Question service has DynamoDB hosted in AWS.

### User Service

User service is using PostgresSQL. You will need to have PostgresSQL installed on your local machine.

We assume the following connection string:
postgresql://postgres:password@localhost:5433/user_service

1. Create a .env file in the root directory of the user service folder. Refer to .env.sample for the environment variables required for the user service to run.
2. Create a database called user_service in PostgresSQL.
3. Table will be created automatically by sequelize when you run the user service.

## Prerequisites

-   NodeJS version >v18
-   PostgresSQL installed on your local machine
-   Ensure .env is cloned in the Frontend folder. You may refer to .env.sample. The .env file contains the environment variables required for the services to run. Ideally, the .env file should not be committed to the repository as it contains sensitive information but we have left the environment variables in the .env.sample file for your convenience.

## Setup Instructions

1. Clone this branch
2. Install the dependencies for each service by running `yarn install` in the respective service folders for Frontend, User Service (Question service database is hosted)
3. Open separate terminals for each service and run the following commands:
    - Frontend: `yarn build` followed by `yarn start`
    - User service: `yarn start`

## Testing Instructions

-   You would need to create a user so that you have access to the dashboard
-   You can create a user by signing up with a new account from the landing page
-   More details are shared in the demo video
-   Do reach out if you need any help
