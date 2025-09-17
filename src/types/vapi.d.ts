declare module "@vapi-ai/web" {
  type VapiEvent =
    | { type: "transcript"; role?: string; message?: string }
    | { type: "function-call"; functionName?: string; arguments?: unknown }
    | Record<string, unknown>;

  export default class Vapi {
    constructor(apiKey: string);
    start(config: unknown): unknown;
    stop(): void;
    say(text: string): void;
    on(event: string, listener: (msg: VapiEvent) => void): void;
    off(event: string, listener: (msg: VapiEvent) => void): void;
    removeAllListeners(): void;
  }
}
