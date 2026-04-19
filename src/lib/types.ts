// ─── Blog ───────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: string;
  tags?: string[];
  seoDescription?: string;
  author: { name: string; avatar: string; role: string };
  publishedAt: string;
  readTime: number;
  featured?: boolean;
}

// ─── Products (Tienda) ──────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  specs: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Resources ──────────────────────────────────────
export interface VademecumItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  indications: string[];
  dose: {
    adult: string;
    pediatric?: string;
  };
  presentations: string[];
  contraindications: string[];
  interactions: string[];
  notes?: string;
  alertLevel?: 'normal' | 'caution' | 'warning';
}

export interface AtlasItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  clinicalFeatures: string;
  treatment: string;
}

export interface EducationItem {
  id: string;
  title: string;
  instructor: string;
  type: 'diplomado' | 'curso' | 'taller' | 'webinar';
  duration: string;
  level: 'basico' | 'intermedio' | 'avanzado';
  description: string;
  image: string;
  price: string;
}

// ─── Community (copied from dentalcore-community) ───
export interface Profile {
  user_id: string;
  handle: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  specialty: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  accepts_referrals: boolean;
  reputation_points: number;
  follower_count: number;
  following_count: number;
  rules_accepted_at: string | null;
  role: 'member' | 'moderator' | 'admin' | 'student';
  study_year?: number | null;   // 1–6, students only
  university?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  post_policy: 'open' | 'admin_only';
}

export type PostType = 'help' | 'resolved' | 'debate' | 'general';

export interface Post {
  id: string;
  author_id: string;
  category_slug: string;
  title: string;
  body: string;
  attachment_urls: string[];
  post_type: PostType | null;
  like_count: number;
  comment_count: number;
  metadata: Record<string, unknown>;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostWithAuthor extends Post {
  author: Profile;
  category: Category;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  is_deleted: boolean;
  created_at: string;
}

export interface CommentWithAuthor extends Comment {
  author: Profile;
}

export interface MarketMeta {
  listing_type: 'sell' | 'buy' | 'trade';
  price: string | null;
  currency: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  item_category: string;
  location: string | null;
  is_sold: boolean;
}

export interface CommunityEvent {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  event_type: 'webinar' | 'congress' | 'course' | 'meetup' | 'workshop';
  event_url: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  is_free: boolean;
  price: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Poll {
  id: string;
  post_id: string;
  question: string;
  options: string[];
  multiple_choice: boolean;
  closes_at: string | null;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  option_index: number;
  created_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  threshold_points: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  badge?: Badge;
}
