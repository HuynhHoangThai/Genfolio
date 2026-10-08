"use client";

// Where someone who already knows what they want commissions it, since a
// template gallery is not everything.
//
// The brief writes itself: every choice on the left lands as a written line on
// the plate to the right, and sending opens a compose window with exactly that
// text in it. Nobody is handed an empty window and asked to start from scratch.
//
// Three send destinations rather than one mailto, because a bare mailto goes
// to whatever the OS registered (Apple Mail on a Mac, for people who have
// never opened it) and dead-ends there. Gmail's compose URL covers most
// visitors, mailto serves real desktop clients, and copying covers the rest.
//
// Nothing is posted or stored: no server route behind this on purpose, so an
// abandoned brief never becomes a record in a database.

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BriefMark } from "./marks";

// The two facts on this surface that are not derived from what the visitor
// picks. Both are quoted verbatim from what the work actually costs and where
// it actually lands, and they are kept together because they are the pair most
// likely to change.
const COMMISSION_EMAIL = "shru.jain2604@gmail.com";
const COMMISSION_NAME = "Shruti";
const STARTING_PRICE = "Rs. 4,999";

// Single choice: what the thing even is.
const BUILD_KINDS = [
  { id: "beyond", label: "Một portfolio khác biệt hoàn toàn với các mẫu sẵn có" },
  { id: "idea", label: "Website cá nhân xoay quanh một ý tưởng độc đáo" },
  { id: "rebuild", label: "Làm mới lại trang web cá nhân hiện có của tôi" },
  { id: "other", label: "Một ý tưởng hoàn toàn khác" },
];

// Multiple choice: the direction.
const DIRECTIONS = [
  { id: "three-d", label: "3D hoặc WebGL" },
  { id: "scroll", label: "Chuyển động theo cuộn chuột (Scroll-driven)" },
  { id: "pastiche", label: "Mô phỏng giao diện: IDE, Terminal, OS" },
  { id: "editorial", label: "Phong cách báo chí & in ấn (Editorial)" },
  { id: "playful", label: "Phong cách game / tương tác thú vị" },
  { id: "data", label: "Trực quan hóa từ dữ liệu thật" },
];

const NOTE_LIMIT = 240;

const SUBJECT = "Yêu cầu thiết kế portfolio riêng";

// The three questions are headings, not captions.
function GroupHead({ step, htmlFor, children }) {
  const inner = (
    <>
      <span className="home-nums shrink-0 text-[13px] text-[var(--home-accent)]">{step}</span>
      <span className="home-grotesque text-[21px] leading-[1.12] sm:text-[25px]">{children}</span>
    </>
  );

  return htmlFor ? (
    <label htmlFor={htmlFor} className="flex items-baseline gap-3">
      {inner}
    </label>
  ) : (
    <legend className="flex items-baseline gap-3">{inner}</legend>
  );
}

export default function CommissionDesk() {
  const [kind, setKind] = useState("");
  const [directions, setDirections] = useState([]);
  const [note, setNote] = useState("");
  const [copy, setCopy] = useState("");
  const copyTimer = useRef(0);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const toggleDirection = (id) => {
    setDirections((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const kindLabel = BUILD_KINDS.find((item) => item.id === kind)?.label || "";
  const trimmedNote = note.trim();

  const rows = [
    {
      key: "build",
      label: "Dạng website mong muốn",
      items: kindLabel ? [{ key: kind, text: kindLabel }] : [],
    },
    {
      key: "direction",
      label: "Định hướng thiết kế",
      items: DIRECTIONS.filter((item) => directions.includes(item.id)).map((item) => ({
        key: item.id,
        text: item.label,
      })),
    },
    {
      key: "notes",
      label: "Mô tả theo ý tưởng cá nhân",
      items: trimmedNote ? [{ key: "note", text: trimmedNote }] : [],
    },
  ];

  const filled = rows.filter((row) => row.items.length > 0);
  const started = filled.length > 0;

  const body = [
    `Chào ${COMMISSION_NAME},`,
    "",
    "Tôi biết đến bạn qua Genfolio và muốn đặt thiết kế một portfolio riêng.",
    "",
    ...(started
      ? filled.flatMap((row) => [row.label + ":", ...row.items.map((item) => `  ${item.text}`), ""])
      : ["Dưới đây là ý tưởng ban đầu của tôi:", "", "", ""]),
    `Tôi được biết chi phí thiết kế khởi điểm từ ${STARTING_PRICE} (đã bao gồm toàn bộ quy trình bàn giao mã nguồn), và rất mong có thể trao đổi chi tiết hơn về phạm vi dự án.`,
    "",
    "Trân trọng,",
    "",
  ].join("\n");

  const subject = encodeURIComponent(SUBJECT);
  const encodedBody = encodeURIComponent(body);

  const mailto = `mailto:${COMMISSION_EMAIL}?subject=${subject}&body=${encodedBody}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    COMMISSION_EMAIL
  )}&su=${subject}&body=${encodedBody}`;

  // The clipboard call throws rather than resolving false when it is
  // unavailable (an insecure origin, or a browser that withholds it), so the
  // failure is caught and said out loud instead of leaving someone pressing a
  // button that silently does nothing. The address is on screen underneath
  // either way, so a failed copy is never a dead end.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${COMMISSION_EMAIL}\nSubject: ${SUBJECT}\n\n${body}`);
      setCopy("done");
    } catch {
      setCopy("failed");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopy(""), 5000);
  };

  return (
    <div className="home-commission grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,33rem)] lg:gap-16">
      <div className="home-reveal">
        <fieldset className="border-0 p-0">
          <GroupHead step="01">Bạn muốn xây dựng gì?</GroupHead>
          <div className="mt-6 flex flex-wrap gap-3">
            {BUILD_KINDS.map((item) => (
              <label key={item.id} className="home-chip">
                <input
                  type="radio"
                  name="commission-kind"
                  value={item.id}
                  checked={kind === item.id}
                  onChange={() => setKind(item.id)}
                  className="sr-only"
                />
                <span className="home-chip-dot" aria-hidden="true" />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-14 border-0 p-0">
          <GroupHead step="02">Định hướng phong cách (chọn bất kỳ)</GroupHead>
          <div className="mt-6 flex flex-wrap gap-3">
            {DIRECTIONS.map((item) => (
              <label key={item.id} className="home-chip">
                <input
                  type="checkbox"
                  value={item.id}
                  checked={directions.includes(item.id)}
                  onChange={() => toggleDirection(item.id)}
                  className="sr-only"
                />
                <span className="home-chip-dot" aria-hidden="true" />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-14">
          <GroupHead step="03" htmlFor="commission-note">
            Tóm tắt ngắn gọn ý tưởng trong đầu bạn
          </GroupHead>
          <textarea
            id="commission-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={NOTE_LIMIT}
            rows={3}
            placeholder="Ví dụ: Một trang web mở ra như một tập hồ sơ mật, hiển thị từng tài liệu một..."
            className="home-field mt-6 w-full resize-none rounded-[var(--home-radius)] px-5 py-4 text-[16px] leading-[1.6]"
          />
          <p className="home-nums mt-2 text-right text-[11px] text-[var(--home-faint)]">
            {note.length}/{NOTE_LIMIT}
          </p>
        </div>
      </div>

      <div className="home-brief-stage lg:-mt-24 lg:sticky lg:top-24 lg:self-start">
        <div className="home-brief-plate home-inset overflow-hidden rounded-xl">
          <div className="flex items-center gap-3 border-b border-white/15 px-7 py-5">
            <BriefMark className="h-5 w-5 shrink-0 text-[var(--home-strong)]" aria-hidden="true" />
            <span className="home-nums truncate text-[15px] text-[var(--home-strong)]">
              Bản tóm tắt yêu cầu
            </span>
            <span className="home-label ml-auto shrink-0 rounded-full border border-white/20 px-3 py-1.5">
              {started ? "Sẵn sàng" : "Bản nháp"}
            </span>
          </div>

          <dl className="min-h-[15rem] space-y-7 px-7 py-7" aria-live="polite">
            {!started && (
              <p className="text-[15px] leading-[1.65] text-[var(--home-faint)]">
                Chọn các mục bên trái và nội dung sẽ tự động xuất hiện tại đây. Đây chính là nội dung email sẽ gửi, đảm bảo không có chi tiết thừa thãi nào ngoài ý muốn của bạn.
              </p>
            )}

            {filled.map((row) => (
              <div key={row.key}>
                <dt className="home-label">{row.label}</dt>
                <dd className="mt-2.5 space-y-2">
                  {row.items.map((item) => (
                    <p
                      key={item.key}
                      className="home-brief-line text-[15px] leading-[1.6] text-[var(--home-text)]"
                    >
                      {item.text}
                    </p>
                  ))}
                </dd>
              </div>
            ))}

          </dl>

          <div className="border-t border-white/15 px-7 py-6">
            <p className="home-label">Khởi điểm từ</p>
            <p className="home-nums mt-2 text-[30px] italic leading-none text-[var(--home-strong)]">
              {STARTING_PRICE}
            </p>
            <p className="mt-3 text-[13px] leading-[1.55] text-[var(--home-faint)]">
              Đã bao gồm bàn giao: mã nguồn trong GitHub và chạy trên Vercel của bạn. Phạm vi cụ thể và chi phí cuối cùng sẽ được thống nhất qua trao đổi trực tiếp.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="home-grotesque text-[19px] leading-none">Gửi yêu cầu qua</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={gmail}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--home-strong)] px-5 py-3 text-[14px] font-medium text-[var(--home-bg)] transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-strong)]"
            >
              Gmail
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>

            <a href={mailto} className="home-quiet-link">
              Ứng dụng Email
            </a>

            <button type="button" onClick={handleCopy} className="home-quiet-link">
              Sao chép nội dung
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-4 min-h-[1.2em] text-[12.5px] leading-[1.55] text-[var(--home-faint)]"
          >
            {copy === "done" && "Đã sao chép kèm địa chỉ nhận. Hãy dán vào ứng dụng email của bạn."}
            {copy === "failed" && "Trình duyệt chặn sao chép. Bạn có thể sao chép địa chỉ bên dưới."}
          </p>

          <p className="mt-1 max-w-[36ch] text-[12.5px] leading-[1.55] text-[var(--home-faint)]">
            Dù bạn chọn cách nào, nội dung bản tóm tắt đã được soạn sẵn. Không có dữ liệu nào tự động gửi hay lưu trữ tại trang này. Bạn cũng có thể gửi thư trực tiếp đến{" "}
            <a href={mailto} className="home-quiet-link">
              {COMMISSION_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
