import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

// 서버와 WebSocket 연결 생성
const socket = io('http://localhost:4000');

function App() {
  const canvasRef = useRef(null); // 캔버스 DOM 참조
  const [shapes, setShapes] = useState([]); // 다이어그램의 도형 상태
  const [draggingId, setDraggingId] = useState(null); // 현재 드래그 중인 도형 ID
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 마우스와 도형의 위치 차이

  // 서버로부터 초기 데이터, 갱신 데이터 수신
  useEffect(() => {
    socket.on('init', (data) => setShapes(data)); // 초기 상태 수신
    socket.on('update', (data) => setShapes(data)); // 다른 사용자의 변경사항 수신
  }, []);

  // 도형 상태가 바뀔 때마다 캔버스 다시 그림
  useEffect(() => {
    drawCanvas();
  }, [shapes]);

  // 캔버스에 도형들을 그림
  const drawCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 800, 600); // 캔버스 초기화

    shapes.forEach(shape => {
      if (shape.type === 'rect') {
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h); // 사각형 그리기
      } else if (shape.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke(); // 선 그리기
      }
    });
  };

  // 사각형 추가 버튼
  const addRect = () => {
    const newShape = {
      id: Date.now().toString(),
      type: 'rect',
      x: 50, y: 50, w: 100, h: 80
    };
    updateShapes([...shapes, newShape]);
  };

  // 선 추가 버튼
  const addLine = () => {
    const newShape = {
      id: Date.now().toString(),
      type: 'line',
      x1: 100, y1: 100, x2: 200, y2: 200
    };
    updateShapes([...shapes, newShape]);
  };

  // 도형 상태 갱신 + 서버에 전송
  const updateShapes = (newShapes) => {
    setShapes(newShapes); // 로컬 상태 갱신
    socket.emit('update', newShapes); // 서버에 전송 → 다른 사용자에게 브로드캐스트
  };

  // 마우스 누를 때 드래그할 도형 결정
  const onMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 클릭한 좌표에 있는 사각형 찾기
    const shape = shapes.find(s =>
      s.type === 'rect' &&
      x >= s.x && x <= s.x + s.w &&
      y >= s.y && y <= s.y + s.h
    );

    if (shape) {
      setDraggingId(shape.id); // 드래그 중인 도형 설정
      setOffset({ x: x - shape.x, y: y - shape.y }); // 마우스 위치 오프셋 계산
    }
  };

  // 마우스 움직일 때 도형 위치 변경
  const onMouseMove = (e) => {
    if (!draggingId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    // 해당 도형 위치 갱신
    const newShapes = shapes.map(s => 
      s.id === draggingId ? { ...s, x, y } : s
    );
    updateShapes(newShapes);
  };

  // 마우스 놓으면 드래그 해제
  const onMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div>
      <h1>Real-time Diagram Editor</h1>
      <button onClick={addRect}>사각형 추가</button>
      <button onClick={addLine}>선 추가</button>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </div>
  );
}

export default App;
