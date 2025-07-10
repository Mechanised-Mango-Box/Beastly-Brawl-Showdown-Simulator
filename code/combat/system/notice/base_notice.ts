export interface BaseNotice<TKind extends string = string, TData = unknown, TCallback = (...args: unknown[]) => void> {
  kind: TKind;
  data: TData;
  callback: TCallback;
}
