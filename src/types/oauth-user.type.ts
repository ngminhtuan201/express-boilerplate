export interface OAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
  avatarUrl?: string;
}
