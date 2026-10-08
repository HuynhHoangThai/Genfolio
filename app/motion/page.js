// Internal gallery for the graphics in components/motion, each at real size so
// they can be reviewed in the running app. Not linked from anywhere, and kept
// out of the index.

import ThoughtsMount from "@/components/motion/ThoughtsMount";
import CelebrationMount from "@/components/motion/CelebrationMount";

export const metadata = {
  title: "Đồ họa chuyển động",
  robots: { index: false, follow: false },
};

export default function MotionPage() {
  return (
    <main className="home-root grow px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="home-label">Hiệu ứng</p>
        <h1 className="mt-3 text-4xl" style={{ fontFamily: "var(--font-instrument)" }}>
          Thư viện đồ họa
        </h1>



        <section className="mt-12">
          <p className="home-label">Ý tưởng (Thoughts)</p>
          <div className="mt-4 rounded-[var(--home-radius)] border border-[var(--home-rule)] bg-[var(--home-surface)]">
            <ThoughtsMount />
          </div>
        </section>


        <section className="mt-12">
          <p className="home-label">Chúc mừng (Celebration)</p>
          <div className="mt-4 rounded-[var(--home-radius)] border border-[var(--home-rule)] bg-[var(--home-surface)]">
            <CelebrationMount />
          </div>
        </section>
      </div>
    </main>
  );
}
