export interface ListenEventTypes {
  onSubmitMove(moveId: string, moveTarget: string): void;
  onRoll(): void;
}
export interface EmitDataTypes {
  chooseMove: { moveIds: string[] };
  roll: { diceFaces: number };
}
export interface CommunicationAdapter {
  subscribe<K extends keyof ListenEventTypes>(target: number, event: K, callback: ListenEventTypes[K]): void;
  unsubscribe<K extends keyof ListenEventTypes>(target: number, event: K): void;
  emit<K extends keyof EmitDataTypes>(target: number, data: EmitDataTypes[K]): void;
}

export type ListenerRegistry = {
  [K in keyof ListenEventTypes]: ListenEventTypes[K] | null;
};
