import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookCardProps } from "@/types";


const BookCard = ({ title, author, coverURL, slug } : BookCardProps) => {
    return (
        <Link href={`/books/${slug}`}>
            <article className="book-card group">
                <div className="book-card-3d book-card-3d-hover">
                    <div className="book-card-spine" />
                    <div className="book-card-cover-wrapper">
                        <Image
                            src={coverURL}
                            alt={title}
                            width={133}
                            height={200}
                            className="book-card-cover"
                        />
                    </div>
                </div>

                <figcaption className="book-card-meta">
                    <div className="book-card-meta">
                        <h3 className="book-card-title">{title}</h3>
                        <p className="book-card-author">{author}</p>
                    </div>

                </figcaption>
            </article>
        </Link>
    )
}
export default BookCard
