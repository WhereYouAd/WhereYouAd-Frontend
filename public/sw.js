//푸시가 왔을때.
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    //JSON이 깨져서 실패하면, 그냥 글자로 읽어서 {body: "글자"} 로 저장.
    //그래도 알림은 띄우기 위함. data가 있을때만 .text() 호출. 없으면 빈문자열
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
