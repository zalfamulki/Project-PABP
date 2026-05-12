self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const { title, body, icon, badge, data: payload } = data;

    const options = {
      body: body || "",
      icon: icon || "/icon-192.png",
      badge: badge || "/icon-192.png",
      vibrate: [200, 100, 200],
      data: payload || {},
      requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    console.error("Push notification error:", e);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const route = event.notification.data?.route || "/";
  const orderId = event.notification.data?.order_id;

  const urlToOpen = new URL(route, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        const matchingClient = windowClients.find(
          (client) => client.url === urlToOpen
        );
        if (matchingClient) {
          return matchingClient.focus();
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
