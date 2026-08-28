import type { IPushSubscriptionRequest } from "@/types/notification/push";

import {
  deletePushSubscription,
  getVapidPublicKey,
  registerPushSubscription,
} from "@/api/notification/notification";

export function isWebPushSupported() {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function registerPushServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/sw.js");
}

//브라우저는 공개키를 글자가 아닌 숫자 배열(바이트)로 받음. 그래서, GET으로 온 문자열 반환
function urlBase64ToUint8Array(base64Url: string) {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

//구독 객체
function toPushSubscriptionRequest(
  subscription: PushSubscription,
): IPushSubscriptionRequest {
  const json = subscription.toJSON();
  return {
    endpoint: json.endpoint ?? "",
    keys: {
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
      p256dhValid: true,
      authValid: true,
    },
    expirationTime: json.expirationTime ?? null,
    userAgent: navigator.userAgent,
    validPushSubscription: true,
    endpointValid: true,
  };
}

//구독 가져오거나 만들기
async function getOrCreateSubscription(publicKey: string) {
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });
}

//토글 on
export async function enableBrowserPushSubscription(orgId: number) {
  if (!isWebPushSupported()) {
    throw new Error("이 브라우저에서는 푸시 알림을 사용할 수 없습니다");
  }

  await registerPushServiceWorker();

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("알림 권한이 거부되었습니다");
  }

  const { publicKey } = await getVapidPublicKey();
  const subscription = await getOrCreateSubscription(publicKey);
  await registerPushSubscription(
    orgId,
    toPushSubscriptionRequest(subscription),
  );
}

//토글 off
export async function disableBrowserPushSubscription(orgId: number) {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await deletePushSubscription(orgId, { endpoint: subscription.endpoint });
}

//워크스페이스 변경
export async function syncPushSubscription(orgId: number) {
  if (!isWebPushSupported()) return;
  if (Notification.permission !== "granted") return;

  await registerPushServiceWorker();
  const { publicKey } = await getVapidPublicKey();
  const subscription = await getOrCreateSubscription(publicKey);
  await registerPushSubscription(
    orgId,
    toPushSubscriptionRequest(subscription),
  );
}
