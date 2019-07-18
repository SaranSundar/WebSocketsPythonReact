import React, {useState} from 'react';
import WebSocketWrapper from "./WebSocketWrapper";

function App() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState("Hello");
    let childMethod = null;

    function handleData(data) {
        console.log("Message received: " + data);
        setCount(data);
    }

    function acceptChildMethod(method) {
        console.log("Setting method");
        console.log(method);
        childMethod = method;
    }

    console.log("Rendering app");
    console.log("CHILD METHOD IS");
    console.log(childMethod);
    return (
        <div>
            Count: <strong>{count}</strong>
            <button onClick={() => childMethod("Hello Server")}>Send Message</button>
            <WebSocketWrapper url='ws://localhost:5000/echo' message={message}
                              reconnect={true} debug={true}
                              shareMethods={acceptChildMethod} onMessage={(data) => handleData(data)}/>
        </div>
    );
}


export default App;