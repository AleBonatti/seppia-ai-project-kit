import { Link } from "react-router-dom";
import { ArrowLeft01Icon, Upload01Icon } from "@/lib/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SaveBar } from "@/components/ui/SaveBar";

// ── Two-column form row (label left, field right) ─────────────────────────────

interface FormRowProps {
    label: string;
    help?: string;
    children: React.ReactNode;
}

function FormRow({ label, help, children }: FormRowProps) {
    return (
        <div className="grid gap-3 py-4 border-t border-(--border) first:border-t-0 first:pt-0" style={{ gridTemplateColumns: "180px 1fr" }}>
            <div className="pt-[9px]">
                <label className="text-[13.5px] font-medium text-(--ink)">{label}</label>
                {help && <p className="text-[12px] text-(--faint) mt-1 leading-relaxed">{help}</p>}
            </div>
            <div>{children}</div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
    { value: "admin", label: "Administrator" },
    { value: "editor", label: "Editor" },
    { value: "author", label: "Author" },
    { value: "user", label: "User" },
];

export default function UserEditPage() {
    // Replace with: const { id } = useParams()
    // Replace with: const { data: user, isLoading } = useUser(id)
    // Replace with: const { form, onSubmit, isSubmitting } = useUserForm({ id })
    const isNew = false; // derive from route: !id

    return (
        <div className="flex flex-col gap-(--gap)">
            {/* Page header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Link to="/admin/users" className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-(--border) text-(--muted) hover:bg-(--surface-2) hover:text-(--ink) transition-colors" aria-label="Back to users">
                        <ArrowLeft01Icon size={16} strokeWidth={2} />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-semibold text-(--ink)">{isNew ? "New User" : "Edit User"}</h1>
                        {!isNew && <p className="text-[13px] text-(--muted) mt-[2px]">Catherine Robertson · Editor</p>}
                    </div>
                </div>
                <div className="flex gap-[9px]">
                    <ButtonLink as={Link} to="/admin/users" variant="secondary">Cancel</ButtonLink>
                    <Button variant="primary">Save</Button>
                </div>
            </div>

            {/* ── Avatar card ── */}
            <Card>
                <div className="mb-1">
                    <h3 className="text-[15px] font-semibold text-(--ink)">Profile</h3>
                    <p className="text-[13px] text-(--muted) mt-0.5">Manage the photo and how this account appears.</p>
                </div>
                <FormRow label="Avatar">
                    <div className="flex items-center gap-4">
                        <div className="w-[72px] h-[72px] rounded-xl bg-(--surface-2) border border-(--border) flex items-center justify-center text-(--faint) flex-none">
                            <Upload01Icon size={22} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex gap-2 mb-2">
                                <Button size="sm" leftIcon={<Upload01Icon size={14} strokeWidth={1.8} />}>
                                    Upload
                                </Button>
                                <Button size="sm" variant="ghost">
                                    Remove
                                </Button>
                            </div>
                            <p className="text-[12px] text-(--faint)">JPG, PNG or GIF. Max size 1 MB.</p>
                        </div>
                    </div>
                </FormRow>
            </Card>

            {/* ── Personal info card ── */}
            <Card>
                <div className="mb-1">
                    <h3 className="text-[15px] font-semibold text-(--ink)">Personal info</h3>
                    <p className="text-[13px] text-(--muted) mt-0.5">Update the user's account details.</p>
                </div>

                <FormRow label="Full name" help="Name shown across the workspace and on posts.">
                    <Input placeholder="Full name" defaultValue="Catherine Robertson" />
                </FormRow>

                <FormRow label="Username" help="Used in the public profile URL.">
                    <Input placeholder="username" defaultValue="c.robertson" className="font-mono" />
                </FormRow>

                <FormRow label="Email" help="The email used to sign in.">
                    <Input type="email" placeholder="email@example.com" defaultValue="francisco94@hotmail.com" className="font-mono" />
                </FormRow>

                <FormRow label="Role" help="Controls what this user can access and edit.">
                    <Select options={ROLE_OPTIONS} defaultValue="editor" />
                </FormRow>

                <FormRow label="Location" help="Used for localisation and timezone defaults.">
                    <Select
                        options={[
                            { value: "", label: "Select country" },
                            { value: "it", label: "Italy" },
                            { value: "us", label: "United States" },
                            { value: "gb", label: "United Kingdom" },
                        ]}
                    />
                </FormRow>

                {/* Inline save bar at bottom of card */}
                <div className="flex items-center justify-between gap-3 flex-wrap border-t border-(--border) pt-5 mt-5">
                    <span className="text-[12.5px] text-(--faint)">Last saved Feb 10, 2026 · 06:16</span>
                    <div className="flex gap-[9px] ml-auto">
                        <ButtonLink as={Link} to="/admin/users" variant="secondary">Cancel</ButtonLink>
                        <Button variant="primary">Save changes</Button>
                    </div>
                </div>
            </Card>

            {/* Sticky save bar — appears when form is dirty */}
            <SaveBar isDirty={false} isLoading={false} onCancel={() => {}} onSave={() => {}} />
        </div>
    );
}
