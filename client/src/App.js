import React, { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    socket.on("init", (data) => setShapes(data));
    socket.on("update", (data) => setShapes(data));
    return () => {
      socket.off("init");
      socket.off("update");
    };
  }, []);

  const addRectangle = () => {
    const newShapes = [...shapes, { id: Date.now(), type: "rect", x: 100, y: 100 }];
    setShapes(newShapes);
    socket.emit("update", newShapes);
  };

  return (
    <div>
      <button onClick={addRectangle}>사각형 추가</button>
      <svg width="800" height="600" style={{ border: "1px solid black" }}>
        {shapes.map((shape) =>
          shape.type === "rect" ? (
            <rect key={shape.id} x={shape.x} y={shape.y} width="100" height="50" fill="skyblue" />
          ) : null
        )}
      </svg>
    </div>
  );
}

export default App;
