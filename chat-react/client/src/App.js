import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);

    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message, ...messages]);
    };
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
      <h1 className="text-2xl font-bold my-2">Chat React</h1>
        <input
          type="text"
          onChange={(i) => setMessage(i.target.value)}
          value={message}
          className="border-2 border-zinc-500 p-2 text-black 2-full"
        />
        <button className="bg-blue-500 ml-3 p-2 rounded-md">send</button>
        <ul className="h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`p-2 my-2 table text-sm rounded-md ${
                message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              <p>
                {message.from}: {message.body}
              </p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
