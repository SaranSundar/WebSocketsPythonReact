import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

function WebSocketWrapper(props) {
    console.log("Rendering Web Socket");
    console.log(props);
    const [ws, setWebSocket] = useState(new WebSocket(props.url, props.protocol));
    const [attempts, setAttempts] = useState(1);
    let timeoutID = null;

    function logMessages(message) {
        if (props.debug === true) {
            console.log(message);
        }
    }

    function generateInterval(k) {
        if (props.reconnectIntervalInMilliSeconds > 0) {
            return props.reconnectIntervalInMilliSeconds;
        }
        return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
    }

    useEffect(() => {
        logMessages("Component Mounted or Updated");
        console.log(props.shareMethods);
        props.shareMethods(sendMessage);
        setupWebsocket();
    });

    function sendMessage() {
        ws.send(props.message)
    }

    useEffect(() => {
        return () => {
            logMessages("Component Will Unmount");
            clearTimeout(timeoutID);
            ws.close();
        }
    }, []);

    function setupWebsocket() {
        ws.onopen = () => {
            logMessages('Websocket connected');
            if (typeof props.onOpen === 'function') {
                props.onOpen();
            }
        };

        ws.onmessage = (evt) => {
            props.onMessage(evt.data);
        };

        ws.onclose = () => {
            logMessages('Websocket disconnected');
            if (typeof props.onClose === 'function') {
                props.onClose();
            }
            if (props.reconnect) {
                let time = generateInterval(attempts);
                timeoutID = setTimeout(() => {
                    setAttempts(attempts + 1);
                    setWebSocket(new WebSocket(props.url, props.protocol));
                    setupWebsocket();
                }, time);
            }
        }
    }

    return (
        <Fragment/>
    )

}

WebSocketWrapper.defaultProps = {
    debug: false,
    reconnect: true
};

WebSocketWrapper.propTypes = {
    url: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool,
    protocol: PropTypes.string,
    shareMethods: PropTypes.func,
    message: PropTypes.string,
    reconnectIntervalInMilliSeconds: PropTypes.number
};

export default WebSocketWrapper;