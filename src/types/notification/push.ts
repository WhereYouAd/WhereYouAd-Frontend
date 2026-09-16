import type { TNotificationType } from "@/types/notification/notification";

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

// payload를 받았을때, 앱도 어떤 거 왔는지 알게 한 뒤, 앱에서 처리할 수 있도록 하는 인터페이스.
// 기존에는 payload 왔다만 알고, 앱에서는 처리할 수 없어서 실시간 알림+1을 처리할 수 없었음.
// 그래서 payload를 받았을때, 브라우저도 어떤 알림이 왔는지 알 수 있도록 처리.
export interface IPushReceivedPayload {
  title?: string;
  body?: string;
  message?: string;
  type?: TNotificationType;
  userNotificationId?: number;
  orgId?: number;
}

export interface IPushReceivedMessage {
  type: "PUSH_RECEIVED";
  payload?: IPushReceivedPayload;
}
