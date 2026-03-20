import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CalendarDays,
  LayoutDashboard,
  Loader2,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Status } from "../backend.d";
import DashboardLayout from "../components/DashboardLayout";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddCheckIn,
  useAddLead,
  useCallerProfile,
  useFieldExecProfile,
  useUpdateLead,
} from "../hooks/useQueries";

const ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  { id: "checkin", label: "Check-in", icon: <MapPin className="w-4 h-4" /> },
  { id: "leads", label: "Leads", icon: <Users className="w-4 h-4" /> },
  {
    id: "tracker",
    label: "Daily Tracker",
    icon: <CalendarDays className="w-4 h-4" />,
  },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  enrolled: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

export default function FieldExecDashboard() {
  const [active, setActive] = useState("overview");
  const { identity } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const { data: fieldExecProfile, isLoading } = useFieldExecProfile(
    identity ? (identity.getPrincipal() as Principal) : undefined,
  );
  const { mutateAsync: addCheckIn, isPending: checkingIn } = useAddCheckIn();
  const { mutateAsync: addLead, isPending: addingLead } = useAddLead();
  const { mutateAsync: updateLead, isPending: updatingLead } = useUpdateLead();

  const [checkInForm, setCheckInForm] = useState({
    location: "",
    notes: "",
    date: "",
  });
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    notes: "",
    status: "new",
  });
  const [editLeadIdx, setEditLeadIdx] = useState<number | null>(null);

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN");

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInForm.location) {
      toast.error("Location is required.");
      return;
    }
    try {
      const dateTs = checkInForm.date
        ? BigInt(new Date(checkInForm.date).getTime()) * BigInt(1_000_000)
        : BigInt(Date.now()) * BigInt(1_000_000);
      await addCheckIn({
        location: checkInForm.location,
        notes: checkInForm.notes,
        date: dateTs,
      });
      toast.success("Check-in submitted!");
      setCheckInForm({ location: "", notes: "", date: "" });
    } catch {
      toast.error("Failed to submit check-in.");
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      toast.error("Name and phone are required.");
      return;
    }
    try {
      const statusMap: Record<string, Status> = {
        new: Status.new_,
        enrolled: Status.enrolled,
        lost: Status.lost,
        contacted: Status.contacted,
      };
      if (editLeadIdx !== null) {
        await updateLead({
          leadIndex: BigInt(editLeadIdx),
          updatedLead: {
            name: leadForm.name,
            phone: leadForm.phone,
            notes: leadForm.notes,
            status: statusMap[leadForm.status] ?? Status.new_,
          },
        });
        toast.success("Lead updated!");
        setEditLeadIdx(null);
      } else {
        await addLead({
          name: leadForm.name,
          phone: leadForm.phone,
          notes: leadForm.notes,
          status: statusMap[leadForm.status] ?? Status.new_,
        });
        toast.success("Lead added!");
      }
      setLeadForm({ name: "", phone: "", notes: "", status: "new" });
    } catch {
      toast.error("Failed to save lead.");
    }
  };

  const leads = fieldExecProfile?.leads ?? [];
  const checkIns = fieldExecProfile?.checkIns ?? [];

  return (
    <DashboardLayout
      title="Field Executive Panel"
      subtitle="Field Exec Portal"
      items={ITEMS}
      activeItem={active}
      onItemClick={setActive}
    >
      {isLoading ? (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="fieldexec.loading_state"
        >
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {active === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-poppins font-bold text-2xl text-foreground">
                  Welcome, {profile?.name ?? "Field Executive"}!
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage your leads, check-ins, and daily activities.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Check-ins",
                    value: String(checkIns.length),
                    icon: MapPin,
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    label: "Total Leads",
                    value: String(leads.length),
                    icon: Users,
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Enrolled",
                    value: String(
                      leads.filter((l) => l.status === "enrolled").length,
                    ),
                    icon: CalendarDays,
                    color: "bg-teal-50 text-teal-600",
                  },
                  {
                    label: "Conversion",
                    value: leads.length
                      ? `${Math.round((leads.filter((l) => l.status === "enrolled").length / leads.length) * 100)}%`
                      : "0%",
                    icon: LayoutDashboard,
                    color: "bg-purple-50 text-purple-600",
                  },
                ].map((s, i) => (
                  <Card
                    key={s.label}
                    className="shadow-card border-border"
                    data-ocid={`fieldexec.card.${i + 1}`}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.color}`}
                      >
                        <s.icon className="w-4 h-4" />
                      </div>
                      <div className="font-poppins font-bold text-xl text-foreground">
                        {s.value}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {s.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {active === "checkin" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                Submit Check-in
              </h2>
              <Card className="shadow-card border-border max-w-md">
                <CardHeader>
                  <CardTitle className="font-poppins text-base">
                    New Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckIn} className="space-y-4">
                    <div>
                      <Label htmlFor="ci-location">Location *</Label>
                      <Input
                        id="ci-location"
                        placeholder="e.g. Lajpat Nagar, Delhi"
                        value={checkInForm.location}
                        onChange={(e) =>
                          setCheckInForm((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                        className="mt-1"
                        data-ocid="fieldexec.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ci-date">Date & Time</Label>
                      <input
                        id="ci-date"
                        type="datetime-local"
                        value={checkInForm.date}
                        onChange={(e) =>
                          setCheckInForm((p) => ({
                            ...p,
                            date: e.target.value,
                          }))
                        }
                        className="mt-1 w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        data-ocid="fieldexec.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ci-notes">Notes</Label>
                      <Input
                        id="ci-notes"
                        placeholder="Optional notes"
                        value={checkInForm.notes}
                        onChange={(e) =>
                          setCheckInForm((p) => ({
                            ...p,
                            notes: e.target.value,
                          }))
                        }
                        className="mt-1"
                        data-ocid="fieldexec.input"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={checkingIn}
                      className="w-full rounded-full bg-primary text-white"
                      data-ocid="fieldexec.submit_button"
                    >
                      {checkingIn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 w-4 h-4" />
                          Submit Check-in
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {active === "leads" && (
            <div className="animate-fade-in space-y-6">
              <h2 className="font-poppins font-bold text-xl text-foreground">
                Lead Management
              </h2>

              {/* Add/Edit Lead Form */}
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="font-poppins text-base flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {editLeadIdx !== null ? "Edit Lead" : "Add New Lead"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleAddLead}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <Label htmlFor="lead-name">Name *</Label>
                      <Input
                        id="lead-name"
                        placeholder="Lead name"
                        value={leadForm.name}
                        onChange={(e) =>
                          setLeadForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="mt-1"
                        data-ocid="fieldexec.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-phone">Phone *</Label>
                      <Input
                        id="lead-phone"
                        placeholder="+91 xxxxx"
                        value={leadForm.phone}
                        onChange={(e) =>
                          setLeadForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="mt-1"
                        data-ocid="fieldexec.input"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="lead-notes">Notes</Label>
                      <Input
                        id="lead-notes"
                        placeholder="Any notes"
                        value={leadForm.notes}
                        onChange={(e) =>
                          setLeadForm((p) => ({ ...p, notes: e.target.value }))
                        }
                        className="mt-1"
                        data-ocid="fieldexec.input"
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={leadForm.status}
                        onValueChange={(v) =>
                          setLeadForm((p) => ({ ...p, status: v }))
                        }
                      >
                        <SelectTrigger
                          className="mt-1"
                          data-ocid="fieldexec.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="enrolled">Enrolled</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        type="submit"
                        disabled={addingLead || updatingLead}
                        className="rounded-full bg-primary text-white"
                        data-ocid="fieldexec.submit_button"
                      >
                        {addingLead || updatingLead ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : editLeadIdx !== null ? (
                          "Update"
                        ) : (
                          "Add Lead"
                        )}
                      </Button>
                      {editLeadIdx !== null && (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            setEditLeadIdx(null);
                            setLeadForm({
                              name: "",
                              phone: "",
                              notes: "",
                              status: "new",
                            });
                          }}
                          data-ocid="fieldexec.cancel_button"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Leads Table */}
              {leads.length ? (
                <Card className="shadow-card border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((l, i) => (
                        <TableRow
                          key={`lead-${l.name}-${l.phone}`}
                          data-ocid={`fieldexec.row.${i + 1}`}
                        >
                          <TableCell>{i + 1}</TableCell>
                          <TableCell className="font-medium">
                            {l.name}
                          </TableCell>
                          <TableCell>{l.phone}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                STATUS_COLORS[l.status] ??
                                "bg-gray-100 text-gray-700"
                              }
                            >
                              {l.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate text-sm">{l.notes}</p>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-primary"
                              onClick={() => {
                                setEditLeadIdx(i);
                                setLeadForm({
                                  name: l.name,
                                  phone: l.phone,
                                  notes: l.notes,
                                  status: l.status,
                                });
                              }}
                              data-ocid="fieldexec.edit_button"
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <Card className="shadow-card border-border">
                  <CardContent
                    className="pt-8 pb-8 text-center"
                    data-ocid="fieldexec.empty_state"
                  >
                    <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No leads yet. Add your first lead above.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {active === "tracker" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                Daily Check-in Tracker
              </h2>
              {checkIns.length ? (
                <Card className="shadow-card border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkIns.map((c, i) => (
                        <TableRow
                          key={`ci-${String(c.date)}`}
                          data-ocid={`fieldexec.row.${i + 1}`}
                        >
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{formatDate(c.date)}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              {c.location}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {c.notes || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <Card className="shadow-card border-border">
                  <CardContent
                    className="pt-8 pb-8 text-center"
                    data-ocid="fieldexec.empty_state"
                  >
                    <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No check-ins recorded yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
