import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Missing Supabase environment variables. Browser-side Supabase features will not work.');
}

// Security: avoid creating a "placeholder" client that could accidentally write to a wrong project.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// 타입 정의
export type Creator = {
    id: string;
    threads_user_id: string;
    username: string;
    name?: string;
    profile_picture_url?: string;
    followers_count?: number;
    access_token?: string;
    created_at: string;
    updated_at: string;
};

export type DailyStat = {
    id: string;
    creator_id: string;
    date: string;
    followers_count: number;
    posts_count: number;
    engagement_rate: number;
    created_at: string;
};

export type Post = {
    id: string;
    creator_id: string;
    threads_post_id: string;
    text?: string;
    likes_count: number;
    comments_count: number;
    views_count: number;
    posted_at: string;
    created_at: string;
};
