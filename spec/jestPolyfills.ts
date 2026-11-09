import { TextDecoder, TextEncoder } from 'util';
import { MessageChannel } from 'worker_threads';

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
// react-dom/server (browser build, React 19) schedules work through
// MessageChannel, which jsdom does not provide.
if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel =
    MessageChannel as unknown as typeof globalThis.MessageChannel;
}
