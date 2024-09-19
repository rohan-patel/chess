// /webrtc/WebRTCClient.ts
import { WebSocketClient } from "./WebSocketClient";

export class WebRTCClient {
  private peerConnection: RTCPeerConnection;
  private websocketClient: WebSocketClient;

  constructor(signalingServerUrl: string) {
    this.websocketClient = new WebSocketClient(signalingServerUrl);
    this.peerConnection = new RTCPeerConnection();

    this.websocketClient.send({ type: "register", data: "client-id" });

    // Set up WebRTC event handlers
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.websocketClient.send({
          type: "candidate",
          data: { candidate: event.candidate },
        });
      }
    };

    this.websocketClient.onmessage = (message) => {
      // Handle signaling messages
    };
  }

  public async createOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.websocketClient.send({
      type: "offer",
      data: { sdp: offer.sdp },
    });
  }

  public async handleOffer(offer: any) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.websocketClient.send({
      type: "answer",
      data: { sdp: answer.sdp },
    });
  }

  public async handleAnswer(answer: any) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  public async handleCandidate(candidate: any) {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  public async close() {
    this.peerConnection.close();
    this.websocketClient.close();
  }
}
