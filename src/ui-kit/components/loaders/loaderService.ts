import { store } from '../../../store/store';
import { hideLoader, showLoader } from '../../../slices/LoaderSlice';

const DEFAULT_MIN_MS = 600;

export function showAppLoader() {
  store.dispatch(showLoader());
}

export function hideAppLoader() {
  store.dispatch(hideLoader());
}

export async function runWithLoader<T>(
  task: () => T | Promise<T>,
  minMs = DEFAULT_MIN_MS,
): Promise<T> {
  showAppLoader();
  const started = Date.now();

  try {
    return await task();
  } finally {
    const remaining = Math.max(0, minMs - (Date.now() - started));
    setTimeout(hideAppLoader, remaining);
  }
}
