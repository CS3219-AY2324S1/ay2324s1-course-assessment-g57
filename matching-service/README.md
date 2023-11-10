## Setup Matching Service

Ensure your current working directory is the `matching-service` folder.

```
npm install
```

This project uses NodeJS version v18.16.1.


### Setup RabbitMQ

To install RabbitMQ on Windows, follow [these](https://www.rabbitmq.com/install-windows.html) installation instructions. For other OSes, follow the relevant instructions [here](https://www.rabbitmq.com/download.html).

For Windows users, we recommend installing via Chocolatey as it automatically installs the relevant dependencies.

After installation, open a terminal in the `sbin` directory in the RabbitMQ installation root and run the following command to check that your installation is working:

```
rabbitmq-diagnostics status
```

For this project, we will assume RabbitMQ has been installed using Chocolatey and configured with the **default settings**.


Points to note:
- RabbitMQ servers (also called nodes) can be managed by [CLI tools](https://www.rabbitmq.com/cli.html) or using a [Management Plugin](https://www.rabbitmq.com/management.html).

- The CLI tools use a shared secret file, called the Erlang cookie, to authenticate with a RabbitMQ node. For Windows users, if your CLI tools cannot authenticate with the RabbitMQ node after installation, you may need to manually copy the Erlang cookie from `C:\Windows\system32\config\systemprofile\.erlang.cookie` to `C:\Users\%USERNAME%\.erlang.cookie`. More information about the Erlang cookie can be found [here](https://www.rabbitmq.com/install-windows.html#cli-cookie-file-location).


## Run Matching Service

Ensure your current working directory is the `matching-service` folder.

Open 2 terminals and run one command in each terminal:

```
node ./controllerServer.js
```

```
node ./matchingServer.js
```


## Test Matching Service

1. Open 2 browser tabs and navigate to `http://localhost:4000`.

1. Enter a user ID, select a difficulty level and click the `Start Match` button to begin.

1. The matching service will match 2 users who have selected the same difficulty level. The match result will be shown on the same page.

1. There is a time limit of 30s for finding a match. If no match is found within the time limit, the match will fail and the user can try again.

Note: The UI prevents the user from clicking the `Start Match` button while waiting for a match or after a successful match. If the match failed, the user can click the `Start Match` button to try again **without refreshing** the page. If the match is successful, a page refresh is required to try matching again.

Note: The server distinguishes clients by the **user ID** they enter. This allows the server to prevent 2 users with the same user ID from making a match request at the same time.
