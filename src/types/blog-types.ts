export type BlogCategory = 'studio-story' | 'growth-story' | 'tiktok-tips' | 'industry-insights';

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: BlogCategory;
    tags: string[];
    thumbnail: string;
    readTime: string;
    author?: string;
    content?: string;
    featured?: boolean;
}

export interface BlogMetadata {
    title: string;
    description: string;
    date: string;
    category: BlogCategory;
    tags: string[];
    thumbnail: string;
    author?: string;
    featured?: boolean;
}

export interface BlogIndex {
    posts: BlogPost[];
    lastUpdated: string;
}
