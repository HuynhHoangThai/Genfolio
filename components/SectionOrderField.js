"use client";

// Lets a customer drag portfolio sections into whatever order they want.
// Only the sections in SECTION_DEFINITIONS are ever passed in here — Intro
// and the closing Contact CTA are anchored first/last by every template and
// never appear in this list, so there's nothing to drag them into a broken
// position.
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SECTION_DEFINITIONS } from "@/lib/portfolioData";

const LABELS = Object.fromEntries(SECTION_DEFINITIONS.map((s) => [s.id, s.label]));

function GripIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <circle cx="6" cy="5" r="1.4" />
      <circle cx="14" cy="5" r="1.4" />
      <circle cx="6" cy="10" r="1.4" />
      <circle cx="14" cy="10" r="1.4" />
      <circle cx="6" cy="15" r="1.4" />
      <circle cx="14" cy="15" r="1.4" />
    </svg>
  );
}

function SortableRow({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "var(--color-sandstone)" : "var(--color-pure-white)",
    borderColor: isDragging ? "var(--color-fresh-grass)" : "var(--color-hairline-mist)",
    color: "var(--color-ink-black)",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2 text-xs font-bold uppercase tracking-[0.5px] transition-colors ${
        isDragging ? "z-10 shadow-md ring-2 ring-[#8ed462]" : "shadow-none"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="ed-focus flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded-[6px] bg-[#f5f1e4] border border-[#d5d5d4] text-[#2c2e2a] hover:bg-[#8ed462] transition-colors active:cursor-grabbing"
        aria-label={`Kéo để sắp xếp lại ${LABELS[id]}`}
      >
        <GripIcon className="h-3.5 w-3.5" />
      </button>
      <span className="flex-1 font-bold text-[#2c2e2a]">{LABELS[id]}</span>
      <span className="font-mono text-[10px] text-[#80827f]">SLOT</span>
    </div>
  );
}

export default function SectionOrderField({ order, onChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);
    onChange(arrayMove(order, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {order.map((id) => (
            <SortableRow key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
