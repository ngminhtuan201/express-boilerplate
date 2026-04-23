import { login, register } from "../auth.service";
import { UserModel } from "../../../models";
import { authHelper } from "../auth.helper";
import { documentId, signVerificationToken } from "../../../libs";
import { errors } from "../../../errors";
import { UserRole } from "../../../enums";

// Mock dependencies
jest.mock("../../../models", () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  RefreshTokenModel: {
    create: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

jest.mock("../auth.helper", () => ({
  authHelper: {
    comparePassword: jest.fn(),
    extractJwtPayloadFromUser: jest.fn(),
    signResponseTokens: jest.fn(),
    isEmailTaken: jest.fn(),
    hashPassword: jest.fn(),
  },
}));

jest.mock("../../../libs", () => ({
  documentId: jest.fn(),
  signVerificationToken: jest.fn(),
}));

describe("Auth Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    const mockLoginDto = { email: "test@test.com", password: "Password123!" };
    const mockUser = {
      id: "123",
      email: "test@test.com",
      hashedPassword: "hashed_password",
      emailVerified: true,
    };

    beforeEach(() => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });
    });

    it("should throw InvalidCredentials if user not found", async () => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(login(mockLoginDto)).rejects.toThrow(
        errors.InvalidCredentials,
      );
    });

    it("should throw InvalidCredentials if user has oauthProvider (no password)", async () => {
      (UserModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest
            .fn()
            .mockResolvedValue({ ...mockUser, oauthProvider: "google" }),
        }),
      });

      await expect(login(mockLoginDto)).rejects.toThrow(
        errors.InvalidCredentials,
      );
    });

    it("should throw InvalidCredentials if password does not match", async () => {
      (authHelper.comparePassword as jest.Mock).mockReturnValue(false);

      await expect(login(mockLoginDto)).rejects.toThrow(
        errors.InvalidCredentials,
      );
      expect(authHelper.comparePassword).toHaveBeenCalledWith(
        "Password123!",
        "hashed_password",
      );
    });

    it("should throw UnverifiedAccount if email is not verified", async () => {
      (authHelper.comparePassword as jest.Mock).mockReturnValue(true);
      (UserModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest
            .fn()
            .mockResolvedValue({ ...mockUser, emailVerified: false }),
        }),
      });

      await expect(login(mockLoginDto)).rejects.toThrow(
        errors.UnverifiedAccount,
      );
    });

    it("should return user and tokens on successful login", async () => {
      (authHelper.comparePassword as jest.Mock).mockReturnValue(true);
      const mockPayload = { userId: "123" };
      (authHelper.extractJwtPayloadFromUser as jest.Mock).mockReturnValue(
        mockPayload,
      );

      const mockTokens = {
        accessToken: { token: "access", expiresAt: new Date() },
        refreshToken: { token: "refresh", expiresAt: new Date() },
      };
      (authHelper.signResponseTokens as jest.Mock).mockReturnValue(mockTokens);

      const result = await login(mockLoginDto);

      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toEqual(mockTokens.accessToken);
      expect(result.refreshToken).toEqual(mockTokens.refreshToken);
      expect(authHelper.extractJwtPayloadFromUser).toHaveBeenCalledWith(
        mockUser,
      );
      expect(authHelper.signResponseTokens).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe("register", () => {
    const mockRegisterDto = {
      email: "test@test.com",
      password: "Password123!",
      fullName: "Test User",
    };

    it("should throw EmailTaken if email already exists", async () => {
      (authHelper.isEmailTaken as jest.Mock).mockResolvedValue(true);

      await expect(register(mockRegisterDto)).rejects.toThrow(
        errors.EmailTaken,
      );
      expect(authHelper.isEmailTaken).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
    });

    it("should create user and return true on success", async () => {
      (authHelper.isEmailTaken as jest.Mock).mockResolvedValue(false);
      (documentId as jest.Mock).mockReturnValue("new-user-id");
      (signVerificationToken as jest.Mock).mockReturnValue("verify-token");
      (authHelper.hashPassword as jest.Mock).mockReturnValue("hashed-pw");

      const result = await register(mockRegisterDto);

      expect(result).toBe(true);
      expect(authHelper.hashPassword).toHaveBeenCalledWith(
        mockRegisterDto.password,
      );

      expect(UserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "new-user-id",
          email: "test@test.com",
          emailVerified: false,
          fullName: "Test User",
          role: UserRole.USER,
          hashedPassword: "hashed-pw",
          verificationToken: "verify-token",
        }),
      );
    });
  });
});
