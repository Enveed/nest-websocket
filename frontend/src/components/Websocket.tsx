import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../contexts/WebsocketContext";

type MessagePayload = {
  content: string;
  msg: string;
};

export const Websocket = () => {
  const socket = useContext(WebsocketContext);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected!");
    });
    socket.on("onMessage", (newMessage: MessagePayload) => {
      console.log("on message event received!");
      console.log(newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      console.log("Unregistering events....");
      socket.off("connect");
      socket.off("onMessage");
    };
  }, []);

  const onSubmit = () => {
    socket.emit("newMessage", input);
    setInput("");
  };

  return (
    <div>
      <div>
        <h1>Websocket Component</h1>
        <div>
          {messages.length === 0 ? (
            <div>No Messages</div>
          ) : (
            <div>
              {messages.map((msg, index) => (
                <div key={index}>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <input
            placeholder="Enter your message..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};
