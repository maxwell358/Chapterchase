"use server";

import dbConnect from "@/lib/db";
import Book from "@/lib/models/book.model";
import BookSegment from "@/lib/models/book-segment.model";
import type { CreateBook } from "@/types";
import { generateSlug, serializeData } from "@/lib/utils";

export type CheckBookExistsResult = {
  exists: boolean
  book?: {
    slug: string
  } | null
}

export type CreateBookResult =
  | {
      success: true
      data: {
        _id: string
        slug: string
      }
      alreadyExists?: boolean
    }
  | {
      success: false
      error?: string
      isBillingError?: boolean
      alreadyExists?: boolean
    }

export type SaveBookSegmentsResult = {
  success: boolean
  error?: string
}

export async function checkBookExists(title: string): Promise<CheckBookExistsResult> {
  try {
    await dbConnect();
    const slug = generateSlug(title);
    const existingBook = await Book.findOne({ slug });

    if (existingBook) {
      return { exists: true, book: { slug: existingBook.slug } };
    }
    return { exists: false, book: null };
  } catch (error) {
    console.error("Error checking book existence:", error);
    return { exists: false, book: null };
  }
}

export async function createBook(input: CreateBook): Promise<CreateBookResult> {
  try {
    await dbConnect();

    const slug = generateSlug(input.title);
    const existingBook = await Book.findOne({ slug });

    if (existingBook) {
      return {
        success: true,
        alreadyExists: true,
        data: {
          _id: existingBook._id.toString(),
          slug: existingBook.slug,
        },
      };
    }

    const newBook = await Book.create({
      ...input,
      slug,
    });

    return {
      success: true,
      data: {
        _id: newBook._id.toString(),
        slug: newBook.slug,
      },
    };
  } catch (error: any) {
    console.error("Error creating book:", error);
    return {
      success: false,
      error: error.message || "Failed to create book",
    };
  }
}

export async function saveBookSegments(
  bookId: string,
  clerkId: string,
  segments: Array<{ text: string; segmentIndex: number; pageNumber?: number; wordCount: number }>
): Promise<SaveBookSegmentsResult> {
  try {
    await dbConnect();

    const segmentsToInsert = segments.map((segment) => ({
      bookId,
      clerkId,
      content: segment.text,
      segmentIndex: segment.segmentIndex,
      pageNumber: segment.pageNumber,
      wordCount: segment.wordCount,
    }));

    await BookSegment.insertMany(segmentsToInsert);

    // Update book with total segments count
    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segments.length,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error saving book segments:", error);
    return {
      success: false,
      error: error.message || "Failed to save book segments",
    };
  }
}
