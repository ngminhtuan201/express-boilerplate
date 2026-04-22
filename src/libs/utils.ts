import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { User } from "../models";

export const catchAsync =
  (fn: (...args: any[]) => any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export const getCurrentUser = (req: Request): User => {
  return req?.user as User;
};

export const handleSuccess = (
  res: Response,
  data: unknown,
  statusCode: number = httpStatus.OK,
  message?: string,
) => {
  return res.status(statusCode).send({ success: true, data, message });
};

export const objectId = (id?: string): mongoose.Types.ObjectId =>
  new mongoose.Types.ObjectId(id);

export const documentId = (): string => nanoid();

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_PAGE_NUMBER = 1;

interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
}

interface PaginatedItems<T> {
  items: Array<T>;
  metadata: PaginationMetadata;
}

export function createPaginatedItems<T>(
  items: Array<T>,
  totalItems: number,
  pageSize: number,
  pageNumber: number,
): PaginatedItems<T> {
  return {
    items: items,
    metadata: {
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      pageSize: pageSize,
      pageNumber: pageNumber,
    },
  };
}

export function getPageSize(req: Request): number {
  const pageSize = +req.query.pageSize;

  return pageSize && Number.isInteger(pageSize) && pageSize >= 1
    ? pageSize
    : DEFAULT_PAGE_SIZE;
}

export function getPageNumber(req: Request): number {
  const pageNumber = +req.query.pageNumber;

  return pageNumber && Number.isInteger(pageNumber) && pageNumber >= 1
    ? pageNumber
    : DEFAULT_PAGE_NUMBER;
}

export function getSortField(
  req: Request,
  fallbackField = "createdAt",
): string | null {
  try {
    return String(req.query?.sortField || "").trim() || fallbackField;
  } catch (error) {
    return fallbackField;
  }
}

export function getSortOrder(
  req: Request,
  fallbackOrder = "desc",
): string | null {
  try {
    return String(req.query?.sortOrder || "").trim() || fallbackOrder;
  } catch (error) {
    return fallbackOrder;
  }
}
