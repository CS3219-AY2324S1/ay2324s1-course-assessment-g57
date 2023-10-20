import React, { useState, useEffect } from "react";
import { socket } from "../../lib/socket";
import ConnectionManager from "./ConnectionManager";

const MatchControls = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [timeElapsed, setTimeElapsed] = useState();
  const [isMatched, setIsMatched] = useState(false);
  const [matchedMessage, setMatchedMessage] = useState("");

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);

      socket.emit("startMatch", "easy");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("matchFound", (message) => {
      setIsMatched(true);
      setTimeElapsed(undefined);
      setMatchedMessage(message);
    });
    socket.on("matchTimerCountdown", (timerCountdown) => {
      setTimeElapsed(timerCountdown);
    });
    socket.on("noMatchTimerExpired", () => {
      setMatchedMessage("No Match Found!");
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      {!isConnected && (
        <div>
          <h1>Client ID:</h1>
          <select id="difficulty">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      {isConnected && (
        <div>
          <h1>Client ID: {socket.id} </h1>
          <h2>{timeElapsed}</h2>
          {isMatched && <h2>{matchedMessage}</h2>}
        </div>
      )}

      <ConnectionManager />
    </div>
  );
};

export default MatchControls;
