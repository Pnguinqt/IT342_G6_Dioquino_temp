import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// FIX for SockJS in Vite
window.global = window;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),

      onConnect: () => {
        console.log("WebSocket connected");

        stompClient.subscribe("/topic/notifications", (msg) => {
          const data = JSON.parse(msg.body);

          setNotifications((prev) => [
            { ...data, time: new Date() },
            ...prev,
          ]);
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return { notifications };
}