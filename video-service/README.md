# PeerPrep
Welcome to PeerPrep, your go-to platform for mastering technical interviews! PeerPrep is designed to help students like you sharpen their coding and problem-solving skills through collaborative learning. Our unique peer matching system connects you with fellow students to practice whiteboard-style interview questions together. Whether you're preparing for coding interviews at top tech companies or looking to enhance your problem-solving abilities, PeerPrep is your ultimate resource. Join our community, level up your technical interview skills, and increase your chances of success in the competitive world of tech recruitment. Happy coding!

## Setup Video Service
This project requires the following:
1. `Node.js`, we are using v18.17.1.
1. A package manager such as `npm` or `yarn`, we are using npm v9.6.7.
1. An agora account, you can sign up for a free account on the [Agora Website](https://www.agora.io/en/) and a project created on the [Agora Console](https://console.agora.io).
1. `agora-access-token`
1. `cors`
1. `dotenv`
1. `express`

To get started, first navigate to the [Agora Website](https://www.agora.io/en/) and create an account and then navigate to the [Agora Console](https://console.agora.io) to create a project. This will allow you to get the `APP_ID` and `APP_CERTIFICATE` necessary for this service to run.

Then create a `.env` file and populate it according to the `.env-sample` sample file.
```
APP_ID=
APP_CERTIFICATE=
PORT=3500
```

Then make sure that you are in the `video-service` folder, then run the following commands to install the necessary dependencies and start the server.
```
npm install
npm start
```
You should see the following text: <Video Service Listening on Port 3500>. If so, then everything is fine and working as intended.

You can then test out the API calls using postman:

| Route | Request Type | url Example |
| ---| --- | ---| 
| /rtc | GET | http://localhost:3500/rtc |
| /rtc/:channel | GET | http://localhost:3500/rtc/VideoChatApp |
