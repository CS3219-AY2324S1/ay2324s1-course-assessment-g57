import React, { createContext, useState } from "react";

export const RoomContext = createContext({
  roomId: "",
  setRoomId: (roomId: string) => {},
});

export const RoomContextProvider = ({ children }: { children: any }) => {
  const [roomId, setRoomId] = useState("");

  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;
