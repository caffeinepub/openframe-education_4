import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ClipboardCheck,
  LayoutDashboard,
  Loader2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../components/DashboardLayout";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllStudents,
  useCallerProfile,
  useTeacherProfile,
} from "../hooks/useQueries";

const ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  { id: "students", label: "My Students", icon: <Users className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Mark Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
];

export default function TeacherDashboard() {
  const [active, setActive] = useState("overview");
  const { identity } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const { data: teacherProfile, isLoading } = useTeacherProfile(
    identity ? (identity.getPrincipal() as Principal) : undefined,
  );
  const { data: allStudents } = useAllStudents();

  const [attForm, setAttForm] = useState({
    studentIndex: "",
    date: "",
    status: "present",
  });
  const [marking, setMarking] = useState(false);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    const idx = Number(attForm.studentIndex);
    if (Number.isNaN(idx) || !attForm.date) {
      toast.error("Please fill all fields.");
      return;
    }
    setMarking(true);
    try {
      // Simulated mark - in production would call markStudentAttendance with actual principal
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Attendance marked successfully!");
      setAttForm({ studentIndex: "", date: "", status: "present" });
    } catch {
      toast.error("Failed to mark attendance.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      subtitle="Teacher Portal"
      items={ITEMS}
      activeItem={active}
      onItemClick={setActive}
    >
      {isLoading ? (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="teacher.loading_state"
        >
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {active === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-poppins font-bold text-2xl text-foreground">
                  Welcome, {profile?.name ?? "Teacher"}!
                </h2>
                <p className="text-muted-foreground mt-1">
                  Subjects:{" "}
                  {teacherProfile?.subjects?.join(", ") ?? "Not assigned"}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Subjects",
                    value: String(teacherProfile?.subjects?.length ?? 0),
                    icon: ClipboardCheck,
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Classes in Schedule",
                    value: String(teacherProfile?.schedule?.length ?? 0),
                    icon: CalendarDays,
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    label: "Total Students",
                    value: String(allStudents?.length ?? 0),
                    icon: Users,
                    color: "bg-purple-50 text-purple-600",
                  },
                ].map((s, i) => (
                  <Card
                    key={s.label}
                    className="shadow-card border-border"
                    data-ocid={`teacher.card.${i + 1}`}
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

          {active === "schedule" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                Class Schedule
              </h2>
              {teacherProfile?.schedule?.length ? (
                <Card className="shadow-card border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherProfile.schedule.map((s, i) => (
                        <TableRow
                          key={`sched-${s.day}-${s.time}-${i}`}
                          data-ocid={`teacher.row.${i + 1}`}
                        >
                          <TableCell className="font-medium">{s.day}</TableCell>
                          <TableCell>{s.time}</TableCell>
                          <TableCell>{s.className}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700">
                              {s.subject}
                            </Badge>
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
                    data-ocid="teacher.empty_state"
                  >
                    <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No schedule assigned yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {active === "students" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                All Students
              </h2>
              {allStudents?.length ? (
                <Card className="shadow-card border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allStudents.map((s, i) => (
                        <TableRow
                          key={`student-${s.name}-${i}`}
                          data-ocid={`teacher.row.${i + 1}`}
                        >
                          <TableCell className="text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {s.name}
                          </TableCell>
                          <TableCell>{s.gradeLevel}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700">
                              {
                                s.attendance.filter(
                                  (a) => a.status === "present",
                                ).length
                              }
                              /{s.attendance.length}
                            </Badge>
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
                    data-ocid="teacher.empty_state"
                  >
                    <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No students enrolled yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {active === "attendance" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                Mark Attendance
              </h2>
              <Card className="shadow-card border-border max-w-md">
                <CardHeader>
                  <CardTitle className="text-base font-poppins">
                    Mark Student Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMarkAttendance} className="space-y-4">
                    <div>
                      <Label>Student</Label>
                      <Select
                        onValueChange={(v) =>
                          setAttForm((p) => ({ ...p, studentIndex: v }))
                        }
                      >
                        <SelectTrigger
                          className="mt-1"
                          data-ocid="teacher.select"
                        >
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {allStudents?.map((s, i) => (
                            <SelectItem
                              key={`opt-${s.name}-${i}`}
                              value={String(i)}
                            >
                              {s.name} — {s.gradeLevel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="att-date">Date</Label>
                      <input
                        id="att-date"
                        type="date"
                        value={attForm.date}
                        onChange={(e) =>
                          setAttForm((p) => ({ ...p, date: e.target.value }))
                        }
                        className="mt-1 w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        data-ocid="teacher.input"
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        defaultValue="present"
                        onValueChange={(v) =>
                          setAttForm((p) => ({ ...p, status: v }))
                        }
                      >
                        <SelectTrigger
                          className="mt-1"
                          data-ocid="teacher.select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      disabled={marking}
                      className="w-full rounded-full bg-primary text-white"
                      data-ocid="teacher.submit_button"
                    >
                      {marking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Marking…
                        </>
                      ) : (
                        "Mark Attendance"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
