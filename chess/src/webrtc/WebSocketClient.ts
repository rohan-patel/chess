// /webrtc/WebSocketClient.ts
export class WebSocketClient {
  private socket: WebSocket | null = null;

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
  }

  private handleMessage(message: any) {
    // Handle incoming WebSocket messages here
  }

  public send(message: any) {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
