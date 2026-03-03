import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '../types/blog-types';
import { getCategoryLabel } from '../lib/blog-utils';

interface BlogCardProps {
    post: BlogPost;
    index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
        >
            <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] overflow-hidden relative">
                        <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/0 transition-colors z-10" />
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 z-20">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-900">
                                {getCategoryLabel(post.category)}
                            </span>
                        </div>
                        {post.featured && (
                            <div className="absolute top-4 right-4 z-20">
                                <span className="bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white">
                                    Featured
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 font-medium uppercase tracking-wide">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(post.date).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                })}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {post.readTime}
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                            {post.title}
                        </h3>

                        <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                            {post.description}
                        </p>

                        <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="text-neutral-900 group-hover:translate-x-1 transition-transform">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
