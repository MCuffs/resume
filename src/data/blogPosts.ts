export type BlogPostItem = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readMinutes: number;
  tags: string[];
  coverGradient: string;
  content: string[];
};

export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: 'why-korean-resume-format-matters',
    title: '한국어 Resume 형식이 중요한 이유',
    summary:
      '한국 채용 문화에서는 어투, 존대, 문장 구성 같은 비즈니스 커뮤니케이션의 정합성이 평가에 큰 영향을 미칩니다.',
    publishedAt: '2026-03-03',
    readMinutes: 4,
    tags: ['Korean Resume', '한국 취업', '이력서 전략'],
    coverGradient: 'from-[#D9F3FF] via-[#F0FAFF] to-white',
    content: [
      '한국 채용 시장에서는 지원자의 경력뿐 아니라 문서의 톤과 문장 구조, 그리고 조직 문화에 맞는 표현이 중요한 평가 요소로 작동합니다. 특히 첫 서류 단계에서는 이력서가 사실상 첫 인상 역할을 하기 때문에, 형식의 완성도가 결과에 직접적인 영향을 줍니다.',
      '많은 외국인 지원자는 글로벌 Resume 형식을 그대로 제출합니다. 문제는 한국 채용 담당자가 익숙한 문서 구조와 다를 때, 내용이 좋아도 전달력이 떨어져 보인다는 점입니다. 같은 경력이어도 한국식 문장 흐름과 항목 구성으로 정리하면 핵심이 더 빠르게 이해됩니다.',
      '또한 한국 기업은 예의범절과 커뮤니케이션 매너를 중요하게 보는 문화가 강합니다. 이력서에서도 과장되지 않은 존중의 어투, 명확한 책임과 성과 중심 문장, 읽기 쉬운 문단 구조가 신뢰를 만듭니다.',
      '결론적으로, 외국식 Resume를 단순 번역하는 것보다 한국어 채용 문서 문법에 맞춰 재구성하는 것이 합격률을 높이는 실전 전략입니다. 같은 경험과 역량이라도, 한국 시장이 읽는 방식으로 전달해야 경쟁력이 생깁니다.',
    ],
  },
];

export function getAllBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

