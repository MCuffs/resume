import { Container } from './Container';

export function Contact() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="max-w-[1000px]">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6">
            Contact
          </h2>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 md:p-12">
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
              프로젝트 문의 또는 파트너/브랜드 제휴는 아래 이메일로 연락주세요.
            </p>

            <a
              href="mailto:alstnwjd0424@gmail.com"
              className="mt-6 inline-flex items-center gap-2 text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              alstnwjd0424@gmail.com
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
