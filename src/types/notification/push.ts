export interface IVapidPublicKeyData {
  publicKey: string;
}

export interface IPushSubscriptionKeys {
  p256dh: string;
  auth: string;
  p256dhValid: boolean;
  authValid: boolean;
}

export interface IPushSubscriptionRequest {
  endpoint: string;
  keys: IPushSubscriptionKeys;
  expirationTime: number | null;
  userAgent: string;
  validPushSubscription: boolean;
  endpointValid: boolean;
}

export interface IDeletePushSubscriptionReqest {
  endpoint: string;
}
