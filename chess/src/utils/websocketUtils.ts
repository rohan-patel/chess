export function createWebSocketConnection(url: string) {
  return new WebSocket(url);
}
