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
      <span className="font-mono shrink-0 text-[12px] font-bold text-[#f68d1f]">{step}</span>
      <span className="text-[17px] sm:text-[20px] font-bold uppercase tracking-[0.2px] text-[#21242e]">{children}</span>
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
    <div className="home-commission grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-14">
      <div className="home-reveal n2001-hardware-card p-6 sm:p-8">
        <fieldset className="border-0 p-0">
          <GroupHead step="01">Bạn muốn xây dựng gì?</GroupHead>
          <div className="mt-5 flex flex-wrap gap-2.5">
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

        <fieldset className="mt-10 border-0 p-0 border-t border-[#3d4f97]/30 pt-8">
          <GroupHead step="02">Định hướng phong cách (chọn bất kỳ)</GroupHead>
          <div className="mt-5 flex flex-wrap gap-2.5">
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

        <div className="mt-10 border-t border-[#3d4f97]/30 pt-8">
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
            className="home-field mt-4 w-full resize-none px-4 py-3 text-[14px] leading-[1.6]"
          />
          <p className="font-mono mt-1 text-right text-[11px] text-[#3d4f97]">
            {note.length}/{NOTE_LIMIT}
          </p>
        </div>
      </div>

      <div className="home-brief-stage lg:-mt-20 lg:sticky lg:top-24 lg:self-start">
        <div className="home-brief-plate n2001-hardware-card-dark overflow-hidden rounded-[4px]">
          <div className="flex items-center gap-3 border-b border-white/20 bg-[#21242e] px-6 py-4">
            <BriefMark className="h-5 w-5 shrink-0 text-[#ecab37]" aria-hidden="true" />
            <span className="font-mono truncate text-[13px] font-bold text-white tracking-[0.5px]">
              BẢN TÓM TẮT YÊU CẦU
            </span>
            <span className="ml-auto shrink-0 rounded-[2px] border border-[#b87c14] bg-[#ecab37] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
              {started ? "SẴN SÀNG" : "BẢN NHÁP"}
            </span>
          </div>

          <dl className="min-h-[14rem] space-y-6 px-6 py-6 bg-[#21242e]/90" aria-live="polite">
            {!started && (
              <p className="text-[14px] leading-[1.65] text-[#9fbee7]">
                Chọn các mục bên trái và nội dung sẽ tự động xuất hiện tại đây. Đây chính là nội dung email sẽ gửi, đảm bảo không có chi tiết thừa thãi nào ngoài ý muốn của bạn.
              </p>
            )}

            {filled.map((row) => (
              <div key={row.key} className="border-b border-white/5 pb-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">{row.label}</dt>
                <dd className="mt-2 space-y-1.5">
                  {row.items.map((item) => (
                    <p
                      key={item.key}
                      className="font-mono text-[13px] leading-[1.5] text-[#dedede]"
                    >
                      • {item.text}
                    </p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-white/15 bg-[#14161d] px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#9fbee7]">Chi phí khởi điểm</p>
            <p className="font-black text-[26px] leading-tight text-[#f68d1f]">
              {STARTING_PRICE}
            </p>
            <p className="mt-2 text-[12px] leading-[1.5] text-[#9fbee7]">
              Bao gồm toàn bộ quy trình bàn giao: mã nguồn trong GitHub và chạy trên Vercel của bạn.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[13px] font-bold uppercase tracking-[0.5px] text-[#21242e]">Gửi yêu cầu qua</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href={gmail}
              target="_blank"
              rel="noreferrer"
              className="n2001-btn-signal text-[11px]"
            >
              <span>GỬI QUA GMAIL</span>
              <span className="font-mono">▶</span>
            </a>

            <a href={mailto} className="n2001-btn-amber text-[11px]">
              ỨNG DỤNG EMAIL
            </a>

            <button type="button" onClick={handleCopy} className="home-quiet-link ml-1">
              Sao chép nội dung
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-3 min-h-[1.2em] text-[11.5px] leading-[1.5] text-[#3d4f97]"
          >
            {copy === "done" && "✓ Đã sao chép kèm địa chỉ nhận. Hãy dán vào ứng dụng email của bạn."}
            {copy === "failed" && "Trình duyệt chặn sao chép. Bạn có thể sao chép địa chỉ bên dưới."}
          </p>

          <p className="mt-1 max-w-[36ch] text-[11.5px] leading-[1.5] text-[#3d4f97]">
            Dù bạn chọn cách nào, nội dung bản tóm tắt đã được soạn sẵn. Bạn cũng có thể gửi thư trực tiếp đến{" "}
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
