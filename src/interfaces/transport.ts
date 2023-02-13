export interface TransportPayload {
  message: string;
}

export interface Transport {
  handle(payload: TransportPayload): void;
}
