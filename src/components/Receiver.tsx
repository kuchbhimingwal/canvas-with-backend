import { useEffect, useState } from "react"
import { useRef } from 'react'
type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
}

type Point = { x: number; y: number } | null

function Receiver() {
  const [currentPoint, setCurrentPoint] = useState(null)
  const [prevPoint, setPrevPoint] = useState(null)
  const [color, setColor] = useState("#000000")
  const canvasRef = useRef(null);
  // @ts-ignore
  const ctx = canvasRef.current?.getContext('2d');
  
  drawLine({ ctx, currentPoint, prevPoint })
  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    if(!prevPoint || !currentPoint) return
    const { x: currX, y: currY } = currentPoint
    // setPrevPoint(prevPoint);
    // setCurrentPoint(currentPoint);
    console.log(prevPoint);
    console.log(currentPoint);
    
    
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
  
  

  const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
      const socket = new WebSocket('ws://localhost:8080');
      setSocket(socket);
      socket.onopen = () =>{
        socket.send(JSON.stringify({type: "receiver"}));
      }
      
      socket.onmessage = async(event) => {
        // @ts-ignore
        const message = JSON.parse(event.data)
        console.log(message);
        setCurrentPoint(message.sdp.currentPoint);
        setPrevPoint(message.sdp.prevPoint);
        setColor(message.sdp.color)
        return () => socket.close();
    }
    },[]);

    
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={750}
        height={750}
        className='border border-black rounded-md'
      />
    </div>
  )
}

export default Receiver