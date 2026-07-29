import { PresenterClient } from './PresenterClient';

export { PresenterClient } from './PresenterClient';
export type { LinkStatus, PresenterStoreState, SendOptions, SyncInfo } from './PresenterClient';
export * from './protocol';

/**
 * WebSocket endpoint of `AltairPresenter`. Defaults to the port used by
 * `Program.cs` (`new AltairPresenter(ip, port, wsPort: 10001)`) and can be
 * overridden with `VITE_PRESENTER_WS_URL` in a `.env` file.
 */
export const PRESENTER_URL: string =
  (import.meta.env.VITE_PRESENTER_WS_URL as string | undefined) ?? 'ws://localhost:10001/';

/**
 * Module-level singleton: one socket for the whole application, reference-counted
 * by its consumers. A socket owned by a component would be opened twice under
 * React StrictMode's double-invoked effects.
 */
export const presenterClient = new PresenterClient(PRESENTER_URL);
