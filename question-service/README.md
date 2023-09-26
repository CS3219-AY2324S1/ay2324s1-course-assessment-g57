# PeerPrep
Welcome to PeerPrep, your go-to platform for mastering technical interviews! PeerPrep is designed to help students like you sharpen their coding and problem-solving skills through collaborative learning. Our unique peer matching system connects you with fellow students to practice whiteboard-style interview questions together. Whether you're preparing for coding interviews at top tech companies or looking to enhance your problem-solving abilities, PeerPrep is your ultimate resource. Join our community, level up your technical interview skills, and increase your chances of success in the competitive world of tech recruitment. Happy coding!

## Setup Question Service
```
cd question-service
npm install --global yarn
yarn install
yarn run dev
```
### Setting up MongoDB
1. Install [MongoDB](https://www.mongodb.com/docs/manual/installation/)
1. Create a question-service database
1. Create a question collection
1. Add `mongodb://127.0.0.1:27017/question-service` to your `.env file` for `local_db_url` and set `ENV=DEV`. This is the default ip address and port for MongoDB. Note that newer versions of NodeJS may not resolve localhost properly.

### Testing API
You may use Postman to test the API but I prefer using Rest Client Extension within VSCode

#### Installation
1. Open Visual Studio Code.

1. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.

1. Search for "REST Client" in the Extensions Marketplace.

1. Click the Install button for the "REST Client" extension by Huachao Mao.

1. Once the installation is complete, you can access the extension from the Extensions view or the integrated terminal.

#### Sending Requests
In the `route.rest` file, place the cursor anywhere in the request block and use the "Send Request" button on top of the block or you can right click anywhere in the request block and select "Send Request".