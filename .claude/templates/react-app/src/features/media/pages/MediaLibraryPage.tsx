import { useState } from "react";
import { Upload01Icon, Search01Icon, Delete01Icon, Cancel01Icon, File01Icon, PdfIcon, Doc01Icon, Xls01Icon, FileZipIcon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardFooter } from "@/components/ui/Card";
import { Pagination } from "@/layouts/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────

type MediaType = "image" | "file";

interface MediaItem {
    id: number;
    type: MediaType;
    name: string;
    ext?: string;
    meta: string;
    mimeType?: string;
    url?: string;
    width?: number;
    height?: number;
    size?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FileTypeIcon({ mimeType, size = 28 }: { mimeType?: string; size?: number }) {
    const props = { size, strokeWidth: 1.6 }
    if (mimeType === 'application/pdf') return <PdfIcon {...props} />
    if (mimeType?.startsWith('application/msword') || mimeType?.includes('wordprocessingml')) return <Doc01Icon {...props} />
    if (mimeType?.includes('spreadsheetml') || mimeType === 'application/vnd.ms-excel') return <Xls01Icon {...props} />
    if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') return <FileZipIcon {...props} />
    return <File01Icon {...props} />
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────

interface MediaThumbProps {
    item: MediaItem;
    onClick: () => void;
}

function MediaThumb({ item, onClick }: MediaThumbProps) {
    return (
        <div
            onClick={onClick}
            className="bg-(--box) border border-(--border) rounded-(--r) overflow-hidden cursor-pointer group hover:border-(--accent) transition-colors"
        >
            <div className="h-[130px] bg-(--surface-2) flex items-center justify-center relative">
                {item.url && item.type === "image" ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center text-(--faint)">
                        {item.ext && <div className="text-[11px] font-bold uppercase tracking-widest mb-1 text-(--muted)">{item.ext}</div>}
                        <FileTypeIcon mimeType={item.mimeType} size={28} />
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="text-[13.5px] font-medium text-(--ink) truncate">{item.name}</div>
                <div className="text-[12px] text-(--faint) truncate mt-0.5">{item.meta}</div>
            </div>
        </div>
    );
}

// ── Detail drawer ─────────────────────────────────────────────────────────────

interface DetailDrawerProps {
    item: MediaItem;
    onClose: () => void;
    onDelete: (id: number) => void;
}

function DetailDrawer({ item, onClose, onDelete }: DetailDrawerProps) {
    const [confirming, setConfirming] = useState(false)

    function handleDelete() {
        if (!confirming) { setConfirming(true); return }
        onDelete(item.id)
        onClose()
    }

    const isImage = item.type === "image"

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel — fixed height = full viewport, never overflows */}
            <div
                className="fixed right-0 top-0 bottom-0 z-50 w-[340px] flex flex-col bg-(--box) border-l border-(--border) shadow-[var(--shadow)]"
                style={{ animation: 'mediaDrawerIn .24s cubic-bezier(.22,.61,.36,1) both' }}
            >
                {/* Header — fixed, never shrinks */}
                <div className="flex-none flex items-center justify-between gap-3 px-5 py-4 border-b border-(--border)">
                    <h3 className="text-[15px] font-semibold text-(--ink) truncate">{item.name}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 flex-none flex items-center justify-center rounded-[7px] text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors"
                    >
                        <Cancel01Icon size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Scrollable body — takes remaining height */}
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 px-5 py-5">
                    {/* Preview — capped so it never alone fills the panel */}
                    <div
                        className="rounded-(--r-sm) bg-(--field) border border-(--border) grid place-items-center text-(--faint) overflow-hidden"
                        style={{ maxHeight: 'min(280px, 40vh)' }}
                    >
                        {isImage && item.url ? (
                            <img
                                src={item.url}
                                alt={item.name}
                                className="w-full object-contain"
                                style={{ maxHeight: 'min(280px, 40vh)' }}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-3 py-8">
                                <FileTypeIcon mimeType={item.mimeType} size={48} />
                                <span className="text-[11px] font-bold tracking-[.06em] text-(--muted) uppercase">
                                    {item.ext ?? 'FILE'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col rounded-(--r-sm) border border-(--border) overflow-hidden">
                        {[
                            { label: 'File name', value: item.name },
                            { label: 'Type',      value: item.mimeType ?? item.ext ?? '—' },
                            { label: 'Size',      value: item.meta },
                            ...(item.width && item.height
                                ? [{ label: 'Dimensions', value: `${item.width} × ${item.height} px` }]
                                : []),
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-start gap-3 px-4 py-[10px] border-b border-(--border) last:border-b-0">
                                <span className="text-[12px] font-medium text-(--muted) w-[90px] flex-none pt-px">{label}</span>
                                <span className="text-[12.5px] text-(--ink) break-all">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions — fixed at bottom */}
                <div className="flex-none px-5 pb-5 pt-4 border-t border-(--border)">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={[
                            'w-full flex items-center justify-center gap-2 px-4 py-[10px] rounded-(--r-sm)',
                            'border font-medium text-[13.5px] cursor-pointer transition-colors',
                            confirming
                                ? 'bg-[#e5484d] border-[#e5484d] text-white hover:bg-[#d03f44]'
                                : 'bg-transparent border-(--border) text-(--muted) hover:border-[color-mix(in_srgb,#e5484d_40%,var(--border))] hover:text-[#e5484d]',
                        ].join(' ')}
                    >
                        <Delete01Icon size={15} strokeWidth={1.8} />
                        {confirming ? 'Confirm delete' : 'Delete file'}
                    </button>
                    {confirming && (
                        <button
                            type="button"
                            onClick={() => setConfirming(false)}
                            className="w-full text-center text-[12px] text-(--muted) mt-2 cursor-pointer hover:text-(--ink) transition-colors bg-transparent border-none"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes mediaDrawerIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
        </>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PLACEHOLDER_ITEMS: MediaItem[] = [
    { id: 1, type: "image", name: "hero-dashboard.jpg", meta: "1.4 MB · 1600×900" },
    { id: 2, type: "image", name: "team-photo.png", meta: "880 KB · 1200×800" },
    { id: 3, type: "file", name: "press-kit.pdf", ext: "PDF", meta: "2.1 MB" },
    { id: 4, type: "image", name: "cover-summer.jpg", meta: "1.1 MB · 1600×900" },
    { id: 5, type: "file", name: "promo-clip.mp4", ext: "MP4", meta: "18 MB · 0:42" },
    { id: 6, type: "image", name: "avatar-david.png", meta: "120 KB · 400×400" },
    { id: 7, type: "file", name: "style-guide.docx", ext: "DOCX", meta: "340 KB" },
    { id: 8, type: "image", name: "chart-export.png", meta: "210 KB · 1024×768" },
    { id: 9, type: "file", name: "assets-bundle.zip", ext: "ZIP", meta: "46 MB" },
    { id: 10, type: "image", name: "mockup-mobile.jpg", meta: "760 KB · 900×1600" },
    { id: 11, type: "file", name: "podcast-ep12.mp3", ext: "MP3", meta: "24 MB · 31:10" },
    { id: 12, type: "image", name: "banner-news.jpg", meta: "1.0 MB · 1600×600" },
];

export default function MediaLibraryPage() {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "image" | "file">("all");
    const [selected, setSelected] = useState<MediaItem | null>(null);
    // Replace with: const deleteMutation = useDeleteMedia()

    const filtered = PLACEHOLDER_ITEMS.filter((m) => {
        if (typeFilter !== "all" && m.type !== typeFilter) return false;
        if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="flex flex-col gap-(--gap)">
            <Card flush>
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap px-(--pad) pt-(--pad) pb-4">
                    <h1 className="text-[20px] font-semibold text-(--ink)">Media Library</h1>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap px-(--pad) pb-4 border-b border-(--border)">
                    <div className="flex items-center gap-2 border border-(--field-border) bg-(--field) rounded-(--r-sm) px-3 h-9 flex-1 min-w-[200px] max-w-[320px]">
                        <Search01Icon size={16} strokeWidth={1.8} className="text-(--faint) flex-none" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files…" className="bg-transparent border-none outline-none text-[13.5px] text-(--ink) placeholder:text-(--faint) w-full" />
                    </div>
                    <div className="flex gap-2">
                        {(["all", "image", "file"] as const).map((t) => (
                            <button key={t} onClick={() => setTypeFilter(t)} className={["px-3 h-8 rounded-(--r-sm) text-[13px] border transition-colors", typeFilter === t ? "bg-(--accent) text-(--accent-ink) border-(--accent) font-semibold" : "bg-transparent text-(--muted) border-(--border) hover:bg-(--surface-2) hover:text-(--ink)"].join(" ")}>
                                {t === "all" ? "All" : t === "image" ? "Images" : "Files"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="p-(--pad)">
                    {filtered.length > 0 ? (
                        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(188px, 1fr))" }}>
                            {filtered.map((item) => (
                                <MediaThumb key={item.id} item={item} onClick={() => setSelected(item)} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-(--muted) text-[14px]">No files found.</div>
                    )}
                </div>

                {/* Footer / Pagination */}
                <CardFooter>
                    <span className="text-[13px] text-(--faint)">
                        Showing 1–{filtered.length} of {filtered.length} files
                    </span>
                    <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
                </CardFooter>
            </Card>

            {selected && (
                <DetailDrawer
                    item={selected}
                    onClose={() => setSelected(null)}
                    onDelete={(id) => {
                        // Replace with: deleteMutation.mutate(id, { onSuccess: () => setSelected(null) })
                        setSelected(null)
                    }}
                />
            )}
        </div>
    );
}
