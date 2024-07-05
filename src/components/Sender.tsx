import { useEffect, useState } from "react"


function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
      const socket = new WebSocket('ws://localhost:8080');
      setSocket(socket);
      socket.onopen = () =>{
        socket.send(JSON.stringify({type: "sender"}));
      }
    },[]);
  return (
    <div>Sender</div>
  )
}

export default Sender