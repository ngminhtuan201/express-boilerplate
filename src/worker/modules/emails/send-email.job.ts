export interface ISendEmailJob {
  type: "verify-email" | "reset-password";
  email: string;
  replacements: Record<string, string>;
}
