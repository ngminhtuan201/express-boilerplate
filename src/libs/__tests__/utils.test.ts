import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import {
  catchAsync,
  createPaginatedItems,
  documentId,
  getCurrentUser,
  getPageNumber,
  getPageSize,
  getSortField,
  getSortOrder,
  handleSuccess,
  objectId,
} from "../utils";

describe("Utils Library", () => {
  describe("catchAsync", () => {
    it("should catch exceptions and call next", async () => {
      const error = new Error("Test error");
      const fn = jest.fn().mockRejectedValue(error);
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();

      catchAsync(fn)(req, res, next);

      // Wait for promise resolution
      await new Promise(process.nextTick);

      expect(fn).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should not call next with error if promise resolves", async () => {
      const fn = jest.fn().mockResolvedValue("Success");
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();

      catchAsync(fn)(req, res, next);

      await new Promise(process.nextTick);

      expect(fn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getCurrentUser", () => {
    it("should return the user from request", () => {
      const mockUser = { id: "123", email: "test@example.com" };
      const req = { user: mockUser } as unknown as Request;

      const user = getCurrentUser(req);
      expect(user).toEqual(mockUser);
    });

    it("should return undefined if user is not in request", () => {
      const req = {} as Request;
      const user = getCurrentUser(req);
      expect(user).toBeUndefined();
    });
  });

  describe("handleSuccess", () => {
    it("should send a successful response with correct structure", () => {
      const sendMock = jest.fn();
      const statusMock = jest.fn().mockReturnValue({ send: sendMock });
      const res = { status: statusMock } as unknown as Response;

      const data = { id: 1 };
      handleSuccess(res, data, httpStatus.CREATED, "Created successfully");

      expect(statusMock).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(sendMock).toHaveBeenCalledWith({
        success: true,
        data,
        message: "Created successfully",
      });
    });

    it("should use default status OK if not provided", () => {
      const sendMock = jest.fn();
      const statusMock = jest.fn().mockReturnValue({ send: sendMock });
      const res = { status: statusMock } as unknown as Response;

      handleSuccess(res, { foo: "bar" });

      expect(statusMock).toHaveBeenCalledWith(httpStatus.OK);
      expect(sendMock).toHaveBeenCalledWith({
        success: true,
        data: { foo: "bar" },
        message: undefined,
      });
    });
  });

  describe("objectId", () => {
    it("should generate a valid mongoose ObjectId", () => {
      const id = objectId();
      expect(mongoose.Types.ObjectId.isValid(id)).toBe(true);
    });

    it("should parse a valid string into ObjectId", () => {
      const hex = "507f1f77bcf86cd799439011";
      const id = objectId(hex);
      expect(id.toHexString()).toBe(hex);
    });
  });

  describe("documentId", () => {
    it("should generate a random nanoid string", () => {
      const id1 = documentId();
      const id2 = documentId();
      expect(typeof id1).toBe("string");
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });
  });

  describe("createPaginatedItems", () => {
    it("should properly structure paginated data", () => {
      const items = [{ id: 1 }, { id: 2 }];
      const result = createPaginatedItems(items, 10, 2, 3);

      expect(result).toEqual({
        items,
        metadata: {
          totalItems: 10,
          totalPages: 5,
          pageSize: 2,
          pageNumber: 3,
        },
      });
    });
  });

  describe("getPageSize", () => {
    it("should return parsed page size from query", () => {
      const req = { query: { pageSize: "10" } } as unknown as Request;
      expect(getPageSize(req)).toBe(10);
    });

    it("should return default page size if query param is missing", () => {
      const req = { query: {} } as unknown as Request;
      expect(getPageSize(req)).toBe(25);
    });

    it("should return default page size if query param is invalid", () => {
      const req = { query: { pageSize: "-5" } } as unknown as Request;
      expect(getPageSize(req)).toBe(25);
    });
  });

  describe("getPageNumber", () => {
    it("should return parsed page number from query", () => {
      const req = { query: { pageNumber: "2" } } as unknown as Request;
      expect(getPageNumber(req)).toBe(2);
    });

    it("should return default page number if missing", () => {
      const req = { query: {} } as unknown as Request;
      expect(getPageNumber(req)).toBe(1);
    });
  });

  describe("getSortField", () => {
    it("should return sortField from query", () => {
      const req = { query: { sortField: "name " } } as unknown as Request;
      expect(getSortField(req)).toBe("name");
    });

    it("should return fallback field if not provided", () => {
      const req = { query: {} } as unknown as Request;
      expect(getSortField(req)).toBe("createdAt");
    });

    it("should return custom fallback field", () => {
      const req = { query: {} } as unknown as Request;
      expect(getSortField(req, "updatedAt")).toBe("updatedAt");
    });
  });

  describe("getSortOrder", () => {
    it("should return sortOrder from query", () => {
      const req = { query: { sortOrder: "asc" } } as unknown as Request;
      expect(getSortOrder(req)).toBe("asc");
    });

    it("should return fallback order if not provided", () => {
      const req = { query: {} } as unknown as Request;
      expect(getSortOrder(req)).toBe("desc");
    });
  });
});
