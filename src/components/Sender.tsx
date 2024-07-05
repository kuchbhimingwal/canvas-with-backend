import { useEffect, useState } from "react"
import { useDraw } from '../../hooks/useDraw'
import { ChromePicker } from 'react-color'
type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
}

type Point = { x: number; y: number }
interface pageProps {}


function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [color, setColor] = useState<string>('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine)
  const [prevPoint, setPrevPoint] = useState<Point | null>(null)
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint
    setPrevPoint(prevPoint);
    setCurrentPoint(currentPoint);
    if(prevPoint && currentPoint){
      socket?.send(JSON.stringify({ type: 'createLine', sdp: {prevPoint, currentPoint, color} }));
    }
    
    const lineColor = color
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)

    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }


    useEffect(()=>{
      const socket = new WebSocket('ws://localhost:8080');
      setSocket(socket);
      socket.onopen = () =>{
        socket.send(JSON.stringify({type: "sender"}));
      }
    },[]);
  return (
    <div className='bg-white flex'>
      <div className='pr-10'>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
          Clear canvas
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className='border border-black rounded-md'
      />
    </div>
  )
}

export default Sender