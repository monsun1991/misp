import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/api/endpoints";
import { useUserStore } from "@/store/useAuthStore";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = useUserStore.getState().accessToken || "";


    let wsUrl = "";
    try {
      wsUrl = BASE_URL ? new URL(BASE_URL).origin : "";
    } catch (error) {
      wsUrl = BASE_URL ? BASE_URL.replace(/\/(api\/)?v[0-9]+\/?$/, "") : "";
    }

    socket = io(wsUrl, {
      auth: { token },
      autoConnect: false,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};
