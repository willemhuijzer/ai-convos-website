// Loaded synchronously in the head: pagereveal can fire before deferred modules.
// A cancelled optional animation must not interfere with normal navigation.
for (const eventName of ["pageswap", "pagereveal"]) {
  window.addEventListener(eventName, (event) => {
    event.viewTransition?.ready.catch(() => {});
  });
}
