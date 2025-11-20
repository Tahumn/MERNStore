import React, { useState } from 'react';

import io from 'socket.io-client';

import SocketContext from './context';
import { SOCKET_URL } from '../../constants';
import { getProfileToken } from '../../utils/profile';

// FORCE REBUILD: 2025-10-22 15:30
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connect = () => {
    const token = getProfileToken();
    // Temporarily disable socket to fix infinite loop - UPDATED 2025-10-22
    console.log('[Socket] Connection disabled temporarily for debugging');
    console.log('[Socket] This message should appear if code is updated');
    return;

    const sk = io(SOCKET_URL, {
      autoConnect: false
    });

    if (token) {
      sk.auth = { token };
      sk.connect();
      sk.auth;
      setSocket(sk);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
