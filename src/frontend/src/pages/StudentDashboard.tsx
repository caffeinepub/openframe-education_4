import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Award,
  BookOpen,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useStudentProfile } from "../hooks/useQueries";

const ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "classes",
    label: "My Classes",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  {
    id: "exams",
    label: "Exams & Results",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: <Award className="w-4 h-4" />,
  },
];

export default function StudentDashboard() {
  const [active, setActive] = useState("overview");
  const { identity } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const { data: studentProfile, isLoading } = useStudentProfile(
    identity ? (identity.getPrincipal() as Principal) : undefined,
  );

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN");

  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="Student Portal"
      items={ITEMS}
      activeItem={active}
      onItemClick={setActive}
    >
      {isLoading ? (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="student.loading_state"
        >
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {active === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-poppins font-bold text-2xl text-foreground">
                  Welcome back, {profile?.name ?? "Student"}!
                </h2>
                <p className="text-muted-foreground mt-1">
                  Grade:{" "}
                  <span className="font-medium text-foreground">
                    {studentProfile?.gradeLevel ?? "Not assigned"}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: "Grade",
                    value: studentProfile?.gradeLevel ?? "—",
                    icon: BookOpen,
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    label: "Attendance",
                    value: studentProfile
                      ? `${studentProfile.attendance.filter((a) => a.status === "present").length}/${studentProfile.attendance.length}`
                      : "—",
                    icon: ClipboardCheck,
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    label: "Exam Taken",
                    value: String(studentProfile?.examResults?.length ?? 0),
                    icon: FileText,
                    color: "bg-purple-50 text-purple-600",
                  },
                  {
                    label: "Certificates",
                    value: String(studentProfile?.certificates?.length ?? 0),
                    icon: Award,
                    color: "bg-yellow-50 text-yellow-600",
                  },
                ].map((s, i) => (
                  <Card
                    key={s.label}
                    className="shadow-card border-border"
                    data-ocid={`student.card.${i + 1}`}
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

          {active === "classes" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                My Classes
              </h2>
              <Card className="shadow-card border-border">
                <CardContent className="pt-6">
                  {studentProfile ? (
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="font-poppins font-bold text-foreground text-lg">
                          {studentProfile.gradeLevel}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Enrolled Grade Level
                        </p>
                      </div>
                      <Badge className="ml-auto bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  ) : (
                    <p
                      className="text-muted-foreground"
                      data-ocid="student.empty_state"
                    >
                      No class assigned yet. Contact admin.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {active === "attendance" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                Attendance Record
              </h2>
              {studentProfile?.attendance?.length ? (
                <Card className="shadow-card border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentProfile.attendance.map((a, i) => (
                        <TableRow
                          key={`att-${String(a.date)}`}
                          data-ocid={`student.row.${i + 1}`}
                        >
                          <TableCell className="text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell>{formatDate(a.date)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                a.status === "present"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {a.status}
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
                    data-ocid="student.empty_state"
                  >
                    <ClipboardCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No attendance records yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {active === "exams" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                Exam Results
              </h2>
              {studentProfile?.examResults?.length ? (
                <Card className="shadow-card border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentProfile.examResults.map((r, i) => (
                        <TableRow
                          key={`exam-${r.subject}-${i}`}
                          data-ocid={`student.row.${i + 1}`}
                        >
                          <TableCell className="text-muted-foreground">
                            {i + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {r.subject}
                          </TableCell>
                          <TableCell>{String(r.score)}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700">
                              {r.grade}
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
                    data-ocid="student.empty_state"
                  >
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No exam results yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {active === "certificates" && (
            <div className="animate-fade-in">
              <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
                My Certificates
              </h2>
              {studentProfile?.certificates?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentProfile.certificates.map((c, i) => (
                    <Card
                      key={`cert-${c.title}-${i}`}
                      className="shadow-card border-border"
                      data-ocid={`student.item.${i + 1}`}
                    >
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
                          <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="font-poppins font-semibold text-foreground">
                          {c.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {formatDate(c.date)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-card border-border">
                  <CardContent
                    className="pt-8 pb-8 text-center"
                    data-ocid="student.empty_state"
                  >
                    <Award className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No certificates yet. Keep learning!
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
