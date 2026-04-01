import React from 'react'
import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const result = await getBookBySlug(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <main className="wrapper container">
            <VapiControls book={result.data} />
        </main>
    )
}

export default Page
