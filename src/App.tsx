import {useEffect, useRef} from 'react'
import {World} from "./world";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
      const world = new World(canvasRef.current!);
      return () => {
          world.close();
      }
  }, []);

  return (
  <canvas ref={canvasRef}></canvas>
)
}

export default App
