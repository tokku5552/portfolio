import { ReadableStream } from 'stream/web';
import { TextDecoder, TextEncoder } from 'util';
import { MessageChannel, MessagePort } from 'worker_threads';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder =
    TextEncoder as unknown as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder =
    TextDecoder as unknown as typeof globalThis.TextDecoder;
}
// jsdom's AbortSignal lacks the static `timeout` helper that Node 22 provides.
if (typeof AbortSignal.timeout !== 'function') {
  AbortSignal.timeout = (ms: number): AbortSignal => {
    const controller = new AbortController();
    setTimeout(
      () => controller.abort(new DOMException('TimeoutError', 'TimeoutError')),
      ms
    );
    return controller.signal;
  };
}
// Node web globals that the Jest jsdom environment does not expose:
// react-dom/server (browser build, React 19) schedules work through
// MessageChannel, and jsdom 30 loads undici, which needs ReadableStream and
// MessagePort at import time.
for (const [name, value] of Object.entries({
  MessageChannel,
  MessagePort,
  ReadableStream,
})) {
  if (!(name in globalThis)) {
    Object.assign(globalThis, { [name]: value });
  }
}
