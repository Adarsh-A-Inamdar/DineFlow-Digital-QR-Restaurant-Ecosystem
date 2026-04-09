import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (url) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(url || 'http://localhost:5001', {
            transports: ['websocket'],
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [url]);

    const emit = (event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    };

    const subscribe = (event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    };

    const join = (room) => {
        if (socketRef.current) {
            socketRef.current.emit('join', room);
        }
    };

    return { socket: socketRef.current, emit, subscribe, join };
};

export default useSocket;
