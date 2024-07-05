import { useEffect, useState } from "react"

function Receiver() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
      const socket = new WebSocket('ws://localhost:8080');
      setSocket(socket);
      socket.onopen = () =>{
        socket.send(JSON.stringify({type: "receiver"}));
      }
    },[]);
  return (
    <div>Receiver</div>
  )
}

export default Receiver