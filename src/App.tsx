import {useEffect, useRef} from 'react'
import {World} from "./world";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
      const world = new World(document.body, canvasRef.current!);
      return () => {
          world.close();
      }
  }, []);

  return (
  <canvas ref={canvasRef} className={"three"}></canvas>
)
}

export default App
