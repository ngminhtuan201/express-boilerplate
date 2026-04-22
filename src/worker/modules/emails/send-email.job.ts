export interface ISendEmailJob {
  type: "verify" | "reset-password";
  receiver: string;
  payload: Record<string, string>;
}
