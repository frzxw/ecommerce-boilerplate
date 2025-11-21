'use client';

import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { useParams } from 'next/navigation';

interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    ogImage: string | null;
}

export default function ArticlePage() {
    const params = useParams();
    const id = params.id as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                const data = await fetchAPI(`/articles/${id}`);
                setArticle(data);
            } catch (error) {
                console.error('Failed to load article', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) {
            loadArticle();
        }
    }, [id]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!article) {
        return <div className="min-h-screen flex items-center justify-center">Article not found</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <Navbar />

            <main className="pt-24 pb-12">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-12 text-center">
                        <div className="flex justify-center items-center gap-4 mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-tight">
                            {article.title}
                        </h1>
                    </header>

                    {article.ogImage && (
                        <div className="relative aspect-video w-full bg-gray-100 mb-12 overflow-hidden">
                            <Image
                                src={article.ogImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter">
                        {/* Simple whitespace handling for now, or use a markdown parser if content is markdown */}
                        <div className="whitespace-pre-wrap">{article.content}</div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
