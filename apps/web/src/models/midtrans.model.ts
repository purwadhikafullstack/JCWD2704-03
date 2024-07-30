interface embedI {
  embedId: string;
  onSuccess?(result: any): void;
  onPending?(result: any): void;
  onError?(result: any): void;
  onClose?(result: any): void;
}
interface Window {
  snap: {
    pay(token: string): void;
    embed(token: string, embed: embedI): void;
  };
}
