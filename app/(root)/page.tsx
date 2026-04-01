import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/actions/book.actions";

const Page = async () =>  {
    const { userId } = await auth();
    let books = [];

    if (userId) {
        const result = await getBooks(userId);
        if (result.success && result.data) {
            books = result.data;
        }
    }

    return (
        <main className="container" data-signed-in={Boolean(userId)}>
            <section className="wrapper">
                <div className="library-hero-card">
                    <div className="grid w-full items-center gap-6 lg:grid-cols-[1.1fr_1fr_0.9fr]">
                        <div className="flex flex-col items-start gap-4 lg:pr-4">
                            <h1 className="library-hero-title">Your library</h1>
                            <p className="library-hero-description max-w-md">
                                Curate vintage reads, save notes, and return to
                                the pages that shaped your thinking.
                            </p>
                            <Link href="/books/new" className="library-cta-primary">
                                Add new book
                            </Link>
                        </div>

                        <div className="flex items-center justify-center">
                            <Image
                                src="/assets/hero-illustration.png"
                                alt="Vintage books, a globe, and a desk lamp"
                                width={320}
                                height={220}
                                className="w-[220px] md:w-[280px] lg:w-[320px] h-auto"
                                priority
                            />
                        </div>

                        <div className="flex w-full justify-start lg:justify-end">
                            <div className="library-steps-card shadow-soft-sm w-full max-w-[260px]">
                                <ol className="flex flex-col gap-4">
                                    <li className="library-step-item">
                                        <span className="library-step-number">1</span>
                                        <div>
                                            <p className="library-step-title">Upload a book</p>
                                            <p className="library-step-description">
                                                Add PDFs or covers in seconds.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="library-step-item">
                                        <span className="library-step-number">2</span>
                                        <div>
                                            <p className="library-step-title">Organize shelves</p>
                                            <p className="library-step-description">
                                                Tag, sort, and track progress.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="library-step-item">
                                        <span className="library-step-number">3</span>
                                        <div>
                                            <p className="library-step-title">Start conversations</p>
                                            <p className="library-step-description">
                                                Ask questions and recall notes.
                                            </p>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper mt-10 lg:mt-14">
                <div className="library-books-grid">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <BookCard
                                key={book._id}
                                title={book.title}
                                author={book.author}
                                coverURL={book.coverURL}
                                slug={book.slug}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="library-empty-state">
                                <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
                                <p className="text-muted-foreground mb-6">Upload your first book to get started.</p>
                                <Link href="/books/new" className="library-cta-primary">
                                    Upload Book
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Page
