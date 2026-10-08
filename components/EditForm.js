"use client";

import { useState, useEffect, useRef } from "react";
import SectionOrderField from "./SectionOrderField";
import { normalizeSectionOrder } from "@/lib/portfolioData";
import { RetroCloseIcon } from "@/components/icons/RetroIcons";

const RESUME_ACCEPT = ".pdf,.docx";

function IconUpload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ResumeImport({ onImport }) {
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file after an error
    if (!file) return;

    setFileName(file.name);
    setStatus("loading");
    setErrorMessage("");

    try {
      const body = new FormData();
      body.append("resume", file);
      const res = await fetch("/api/parse-resume", { method: "POST", body });

      // Not every failure comes back as JSON. A request that never reaches the
      // route at all, because the platform rejected the upload as too large or
      // the function timed out, answers with an HTML error page instead, and
      // parsing that as JSON used to throw a SyntaxError whose message ("
      // Unexpected token '<'") was then shown to the customer as though it
      // were the explanation. Read the body once as text and decide from
      // there, so the message they see always describes what happened.
      const raw = await res.text();
      let result = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        result = null;
      }

      if (!res.ok || !result) {
        throw new Error(
          result?.error ||
            (res.status === 413
              ? "Tệp tải lên quá lớn. Vui lòng chọn tệp dưới 4MB."
              : res.status === 504
                ? "Quá trình đọc CV mất quá nhiều thời gian. Vui lòng thử lại với tệp ngắn gọn hơn."
                : `Máy chủ không thể xử lý tệp tải lên (lỗi ${res.status}). Vui lòng thử lại.`)
        );
      }

      onImport(result.data);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="ed-panel overflow-hidden">
      <div className="n2001-section-bar">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#21242e] text-[#f68d1f]">
            <IconUpload className="h-3 w-3" />
          </span>
          <span>≡ EXPANSION PAK // NHẬP DỮ LIỆU TỪ CV</span>
        </div>
        <span className="rounded-[2px] bg-[#ecab37] px-1.5 py-0.5 text-[9px] font-extrabold text-[#21242e]">AUTO-FILL</span>
      </div>
      <div className="p-4">
        <p className="text-xs leading-relaxed text-[#3d4f97]">
          Tải lên tệp PDF hoặc DOCX để hệ thống tự động điền các mục bên dưới. Vui lòng kiểm tra lại thông tin sau khi trích xuất.
        </p>

        <label
          className={`n2001-btn-signal mt-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.5px] ${
            status === "loading" ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <IconUpload className="h-3.5 w-3.5" />
          {status === "loading" ? "ĐANG ĐỌC CV…" : "CHỌN TỆP CV ▶"}
          <input
            type="file"
            accept={RESUME_ACCEPT}
            onChange={handleFileChange}
            disabled={status === "loading"}
            className="sr-only"
          />
        </label>

        {status === "loading" && fileName && (
          <p className="mt-2 text-xs text-[#3d4f97]">
            Đang phân tích {fileName}…
          </p>
        )}
        {status === "error" && (
          <p className="mt-2 text-xs font-bold text-[#e60012]" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="m2 13 10 5 10-5" />
    </svg>
  );
}

// Reordering sections
function SectionOrderCard({ order, onChange }) {
  return (
    <div className="ed-panel overflow-hidden">
      <div className="n2001-section-bar">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#21242e] text-[#ecab37]">
            <IconLayers className="h-3 w-3" />
          </span>
          <span>≡ CONTROLLER PAK // SẮP XẾP THỨ TỰ</span>
        </div>
        <span className="rounded-[2px] bg-[#ecab37] px-1.5 py-0.5 text-[9px] font-extrabold text-[#21242e]">
          MỚI
        </span>
      </div>
      <div className="p-4">
        <p className="mb-3 text-xs leading-relaxed text-[#3d4f97]">
          Kéo thả để sắp xếp thứ tự ưu tiên: hiển thị Dự án lên trước nếu đó là thế mạnh của bạn, hoặc Kinh nghiệm làm việc. Giới thiệu và Liên hệ luôn cố định ở đầu và cuối.
        </p>
        <SectionOrderField order={order} onChange={onChange} />
      </div>
    </div>
  );
}

function FormSection({ title, hint, children }) {
  return (
    <section className="ed-panel overflow-hidden">
      <div className="n2001-section-bar">
        <span>≡ {title.toUpperCase()}</span>
        <span className="font-mono text-[9px] text-[#21242e]/70">SLOT-ACTIVE</span>
      </div>
      <div className="p-4">
        {hint && (
          <p className="mb-3 text-[11px] font-semibold text-[#3d4f97]">
            {hint}
          </p>
        )}
        <div className="space-y-3.5">{children}</div>
      </div>
    </section>
  );
}

function FieldLabel({ children }) {
  return (
    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.5px] text-[#3d4f97]">
      {children}
    </span>
  );
}

function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input {...props} className="ed-field px-3 py-1.5 text-xs font-medium" />
      {hint && (
        <span className="mt-1 block text-[10px] text-[#60619c]">
          {hint}
        </span>
      )}
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea {...props} rows={3} className="ed-field px-3 py-2 text-xs font-medium" />
    </label>
  );
}

// A plain <input> whose value is `list.join(", ")`, re-parsed on every
// keystroke, fights the user: type a trailing comma to start the next item
// and the very next render reconstructs the value from the just-parsed
// array — which drops the empty trailing segment — silently erasing the
// comma you just typed. Keeps its own local text buffer while focused, and
// only commits (parses + calls onChange) on blur, so typing "React, " never
// gets fought mid-keystroke. Resyncs from `value` when it changes for a
// reason other than this field's own commit (e.g. resume import replacing
// the list), tracked via lastCommitted so an echo of our own update isn't
// mistaken for an external change.
function CommaListField({ label, hint, value, onChange }) {
  const [text, setText] = useState(() => value.join(", "));
  const lastCommitted = useRef(value.join(", "));

  useEffect(() => {
    const joined = value.join(", ");
    if (joined !== lastCommitted.current) {
      setText(joined);
      lastCommitted.current = joined;
    }
  }, [value]);

  function commit(raw) {
    const next = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    lastCommitted.current = next.join(", ");
    onChange(next);
  }

  return (
    <Field
      label={label}
      hint={hint}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={(e) => commit(e.target.value)}
    />
  );
}

function RemovableRow({ onRemove, children }) {
  return (
    <div
      className="relative rounded-[2px] border p-3.5 border-t-[rgba(255,255,255,0.7)] border-l-[rgba(255,255,255,0.5)] border-r-[#3d4f97] border-b-2 border-b-[#3d4f97] bg-[#f0f2f8] shadow-sm"
    >
      <button
        type="button"
        onClick={onRemove}
        className="ed-focus absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-[2px] bg-[#e60012] text-white border-t border-t-[rgba(255,255,255,0.6)] border-b border-b-[#7a181b] shadow-sm hover:brightness-110 active:translate-y-[1px] cursor-pointer"
        aria-label="Xóa"
      >
        <RetroCloseIcon className="w-2.5 h-2.5 text-white" />
      </button>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="n2001-btn-amber ed-focus w-full py-2 text-xs font-bold uppercase tracking-[0.5px]"
    >
      {children}
    </button>
  );
}

// Templates that actually render a photo (person or project image) — every
// other template ignores photoUrl/project.image entirely, so those fields
// only appear in the form when the selected template is one of these.
// Showing them unconditionally for every template is what made the field
// look "broken" for anyone not on one of these three.
const TEMPLATES_WITH_PHOTOS = new Set(["warm", "scrapbook", "spotify"]);

// Artist Profile is the only template with a player bar, so it is the only one
// with anywhere to put a song. Same gating rule as the photo fields above: a
// field nothing renders looks broken to whoever is filling it in.
const TEMPLATES_WITH_NOW_PLAYING = new Set(["spotify"]);

export default function EditForm({ data, onChange, templateId }) {
  const set = (patch) => onChange({ ...data, ...patch });
  const showPhotoFields = TEMPLATES_WITH_PHOTOS.has(templateId);
  const showNowPlaying = TEMPLATES_WITH_NOW_PLAYING.has(templateId);

  const setLink = (key, value) =>
    set({ links: { ...data.links, [key]: value } });

  const setNowPlaying = (key, value) =>
    set({ nowPlaying: { ...data.nowPlaying, [key]: value } });

  // A resume import is an authoritative snapshot, not a patch — it replaces
  // these fields exactly as extracted, including empty ones. Falling back to
  // "keep the existing value when the resume has none" sounds safer, but the
  // form starts pre-filled with placeholder demo data, and that fallback
  // can't tell the difference between "the user already typed something
  // real" and "this is still the untouched Ada Lovelace sample" — so an
  // empty Experience section in the resume ended up keeping fake jobs
  // instead of actually being empty. photoUrl isn't part of `imported` at
  // all, so it's untouched either way.
  const importResume = (imported) =>
    set({
      name: imported.name,
      role: imported.role,
      bio: imported.bio,
      email: imported.email,
      links: imported.links,
      skills: imported.skills,
      codingProfiles: imported.codingProfiles,
      experience: imported.experience,
      education: imported.education,
      achievements: imported.achievements,
      projects: imported.projects,
    });

  const setAchievements = (raw) =>
    set({
      achievements: raw.split("\n").filter((line) => line.trim().length > 0),
    });

  const updateCodingProfile = (index, patch) => {
    const next = data.codingProfiles.map((p, i) => (i === index ? { ...p, ...patch } : p));
    set({ codingProfiles: next });
  };

  const addCodingProfile = () =>
    set({ codingProfiles: [...data.codingProfiles, { platform: "", url: "" }] });

  const removeCodingProfile = (index) =>
    set({ codingProfiles: data.codingProfiles.filter((_, i) => i !== index) });

  const updateExperience = (index, patch) => {
    const next = data.experience.map((job, i) =>
      i === index ? { ...job, ...patch } : job
    );
    set({ experience: next });
  };

  const updateExperienceBullets = (index, raw) => {
    updateExperience(index, {
      bullets: raw.split("\n").filter((line) => line.trim().length > 0),
    });
  };

  const addExperience = () =>
    set({
      experience: [
        ...data.experience,
        { company: "", role: "", start: "", end: "", image: "", bullets: [] },
      ],
    });

  const removeExperience = (index) =>
    set({ experience: data.experience.filter((_, i) => i !== index) });

  const updateEducation = (index, patch) => {
    const next = data.education.map((edu, i) => (i === index ? { ...edu, ...patch } : edu));
    set({ education: next });
  };

  const addEducation = () =>
    set({
      education: [...data.education, { school: "", degree: "", start: "", end: "" }],
    });

  const removeEducation = (index) =>
    set({ education: data.education.filter((_, i) => i !== index) });

  const updateProject = (index, patch) => {
    const next = data.projects.map((p, i) => (i === index ? { ...p, ...patch } : p));
    set({ projects: next });
  };

  const updateProjectHighlights = (index, raw) => {
    updateProject(index, {
      highlights: raw.split("\n").filter((line) => line.trim().length > 0),
    });
  };

  const addProject = () =>
    set({
      projects: [
        ...data.projects,
        {
          name: "",
          version: "",
          status: "Active",
          image: "",
          description: "",
          tags: [],
          link: "",
          demo: "",
          highlights: [],
        },
      ],
    });

  const removeProject = (index) =>
    set({ projects: data.projects.filter((_, i) => i !== index) });

  return (
    <div className="space-y-6">
      <ResumeImport onImport={importResume} />

      <SectionOrderCard
        order={normalizeSectionOrder(data.sectionOrder)}
        onChange={(sectionOrder) => set({ sectionOrder })}
      />

      <FormSection title="Thông tin cơ bản">
        <Field
          label="Họ và tên"
          value={data.name}
          onChange={(e) => set({ name: e.target.value })}
        />
        <Field
          label="Vị trí / Chức danh"
          value={data.role}
          onChange={(e) => set({ role: e.target.value })}
        />
        <TextArea
          label="Giới thiệu bản thân (Bio)"
          value={data.bio}
          onChange={(e) => set({ bio: e.target.value })}
        />
        <Field
          label="Email liên hệ"
          value={data.email}
          onChange={(e) => set({ email: e.target.value })}
        />
        {showPhotoFields && (
          <Field
            label="URL ảnh đại diện (tùy chọn)"
            hint="Nên dùng ảnh chân dung tự nhiên, chất lượng tốt thay vì ảnh thẻ cứng nhắc."
            value={data.photoUrl || ""}
            onChange={(e) => set({ photoUrl: e.target.value })}
          />
        )}
        {showNowPlaying && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Đang phát: bài hát (tùy chọn)"
              hint="Hiển thị trên thanh phát nhạc. Để trống sẽ dùng mặc định Frank Sinatra, My Way."
              value={data.nowPlaying?.track || ""}
              onChange={(e) => setNowPlaying("track", e.target.value)}
            />
            <Field
              label="Đang phát: nghệ sĩ (tùy chọn)"
              value={data.nowPlaying?.artist || ""}
              onChange={(e) => setNowPlaying("artist", e.target.value)}
            />
            <div className="sm:col-span-2">
              <Field
                label="Đang phát: liên kết (tùy chọn)"
                hint="Dẫn link bài hát trên YouTube hoặc Spotify. Để trống sẽ chỉ hiển thị dạng chữ."
                value={data.nowPlaying?.url || ""}
                onChange={(e) => setNowPlaying("url", e.target.value)}
              />
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Liên kết cá nhân & Mạng xã hội">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field
            label="GitHub"
            value={data.links.github}
            onChange={(e) => setLink("github", e.target.value)}
          />
          <Field
            label="LinkedIn"
            value={data.links.linkedin}
            onChange={(e) => setLink("linkedin", e.target.value)}
          />
          <Field
            label="Website cá nhân"
            value={data.links.website}
            onChange={(e) => setLink("website", e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title="Kỹ năng chuyên môn" hint="Cách nhau bằng dấu phẩy.">
        <CommaListField label="Kỹ năng" value={data.skills} onChange={(skills) => set({ skills })} />
      </FormSection>

      <FormSection title="Hồ sơ lập trình" hint="Tùy chọn — LeetCode, Codeforces, HackerRank, Kaggle, GitHub, v.v.">
        {data.codingProfiles.map((profile, i) => (
          <RemovableRow key={i} onRemove={() => removeCodingProfile(i)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Nền tảng"
                value={profile.platform}
                onChange={(e) => updateCodingProfile(i, { platform: e.target.value })}
              />
              <Field
                label="Đường dẫn hồ sơ"
                value={profile.url}
                onChange={(e) => updateCodingProfile(i, { url: e.target.value })}
              />
            </div>
          </RemovableRow>
        ))}
        <AddButton onClick={addCodingProfile}>+ Thêm hồ sơ lập trình</AddButton>
      </FormSection>

      <FormSection title="Kinh nghiệm làm việc">
        {data.experience.map((job, i) => (
          <RemovableRow key={i} onRemove={() => removeExperience(i)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Công ty / Tổ chức"
                value={job.company}
                onChange={(e) => updateExperience(i, { company: e.target.value })}
              />
              <Field
                label="Vị trí đảm nhiệm"
                value={job.role}
                onChange={(e) => updateExperience(i, { role: e.target.value })}
              />
              <Field
                label="Bắt đầu"
                value={job.start}
                onChange={(e) => updateExperience(i, { start: e.target.value })}
              />
              <Field
                label="Kết thúc"
                value={job.end}
                onChange={(e) => updateExperience(i, { end: e.target.value })}
              />
            </div>
            {showPhotoFields && (
              <Field
                label="URL hình ảnh (tùy chọn)"
                hint="Ảnh chụp tính năng đã phát triển, khoảnh khắc cùng nhóm hoặc giải thưởng. Để trống nếu bỏ qua."
                value={job.image || ""}
                onChange={(e) => updateExperience(i, { image: e.target.value })}
              />
            )}
            <TextArea
              label="Điểm nổi bật (mỗi dòng một ý)"
              value={job.bullets.join("\n")}
              onChange={(e) => updateExperienceBullets(i, e.target.value)}
            />
          </RemovableRow>
        ))}
        <AddButton onClick={addExperience}>+ Thêm kinh nghiệm</AddButton>
      </FormSection>

      <FormSection title="Học vấn & Bằng cấp">
        {data.education.map((edu, i) => (
          <RemovableRow key={i} onRemove={() => removeEducation(i)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Trường / Cơ sở đào tạo"
                value={edu.school}
                onChange={(e) => updateEducation(i, { school: e.target.value })}
              />
              <Field
                label="Bằng cấp / Chuyên ngành"
                value={edu.degree}
                onChange={(e) => updateEducation(i, { degree: e.target.value })}
              />
              <Field
                label="Bắt đầu"
                value={edu.start}
                onChange={(e) => updateEducation(i, { start: e.target.value })}
              />
              <Field
                label="Kết thúc"
                value={edu.end}
                onChange={(e) => updateEducation(i, { end: e.target.value })}
              />
            </div>
          </RemovableRow>
        ))}
        <AddButton onClick={addEducation}>+ Thêm học vấn</AddButton>
      </FormSection>

      <FormSection title="Thành tựu & Chứng chỉ" hint="Mỗi dòng một mục.">
        <TextArea
          label="Danh sách thành tựu"
          value={(data.achievements || []).join("\n")}
          onChange={(e) => setAchievements(e.target.value)}
        />
      </FormSection>

      <FormSection title="Dự án tiêu biểu">
        {data.projects.map((project, i) => (
          <RemovableRow key={i} onRemove={() => removeProject(i)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field
                label="Tên dự án"
                value={project.name}
                onChange={(e) => updateProject(i, { name: e.target.value })}
              />
              <Field
                label="Phiên bản"
                value={project.version}
                onChange={(e) => updateProject(i, { version: e.target.value })}
              />
              <Field
                label="Trạng thái (Active / Archived / WIP)"
                value={project.status}
                onChange={(e) => updateProject(i, { status: e.target.value })}
              />
            </div>
            {showPhotoFields && (
              <Field
                label="URL ảnh chụp dự án (tùy chọn)"
                hint="Để trống sẽ hiển thị khung placeholder mặc định."
                value={project.image || ""}
                onChange={(e) => updateProject(i, { image: e.target.value })}
              />
            )}
            <TextArea
              label="Mô tả ngắn gọn"
              value={project.description}
              onChange={(e) => updateProject(i, { description: e.target.value })}
            />
            <TextArea
              label="Điểm nổi bật (mỗi dòng một ý)"
              value={(project.highlights || []).join("\n")}
              onChange={(e) => updateProjectHighlights(i, e.target.value)}
            />
            <CommaListField
              label="Thẻ công nghệ (cách nhau bằng dấu phẩy)"
              value={project.tags}
              onChange={(tags) => updateProject(i, { tags })}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Liên kết mã nguồn (Repo)"
                value={project.link}
                onChange={(e) => updateProject(i, { link: e.target.value })}
              />
              <Field
                label="Liên kết xem thử (Live demo)"
                value={project.demo}
                onChange={(e) => updateProject(i, { demo: e.target.value })}
              />
            </div>
          </RemovableRow>
        ))}
        <AddButton onClick={addProject}>+ Thêm dự án</AddButton>
      </FormSection>
    </div>
  );
}
