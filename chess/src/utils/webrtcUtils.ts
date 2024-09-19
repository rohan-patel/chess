export function createPeerConnection(config: RTCConfiguration) {
  return new RTCPeerConnection(config);
}
