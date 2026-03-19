import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
    return (
        <section className="library-hero-card overflow-hidden">
            <div className="grid w-full items-center gap-8 lg:grid-cols-2">
                <div className="flex flex-col items-start gap-6 lg:pr-8">
                    <div className="space-y-4">
                        <h1 className="library-hero-title text-4xl md:text-5xl lg:text-6xl">
                            Turn your books into <span className="text-[var(--accent-warm)]">conversations</span>
                        </h1>
                        <p className="library-hero-description text-lg md:text-xl max-w-xl">
                            Upload your PDFs and engage in natural voice interviews with your books. 
                            Rediscover your library through interactive AI dialogue.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link href="/books/new" className="library-cta-primary text-center">
                            Upload a Book
                        </Link>
                        <Link href="#library" className="library-cta-secondary text-center border border-[var(--brand-primary)]/10 px-6 py-3 rounded-xl hover:bg-[var(--brand-primary)]/5 transition-all">
                            Browse Library
                        </Link>
                    </div>
                </div>

                <div className="relative flex items-center justify-center lg:justify-end">
                    <div className="relative w-full max-w-[400px] aspect-[4/3]">
                        <Image
                            src="/assets/hero-illustration.png"
                            alt="Interactive book reading illustration"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--accent-warm)]/10 rounded-full blur-2xl -z-10" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[var(--brand-primary)]/5 rounded-full blur-3xl -z-10" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;