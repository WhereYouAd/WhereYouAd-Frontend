//푸시가 왔을때. 토글 on시
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() ?? "" };
  }

  const title = payload.title ?? "알림";
  const body = payload.body ?? payload.message ?? "";

  event.waitUntil(async () => {
    await self.registration.showNotification(title, {
      body,
      data: payload,
    });
    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });
    clients.forEach((client) => {
      client.postMessage({ type: "PUSH_RECEIVED" });
    });
  });
});

//알림 클릭시
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = "/dashboard";

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const existing = clients.find((client) => "focus" in client);
      if (existing) {
        await existing.focus();
        return;
      }
      await self.clients.openWindow(url);
    })(),
  );
});
