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
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  Loader2,
  Mail,
  MapPin,
  Newspaper,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BlogPost } from "../backend.d";
import DashboardLayout from "../components/DashboardLayout";
import {
  useAllFieldExecs,
  useAllStudents,
  useAllTeachers,
  useBlogPosts,
  useCallerProfile,
  useContactSubmissions,
  useCreateOrUpdateBlogPost,
  useDemoBookings,
} from "../hooks/useQueries";

const ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  { id: "students", label: "Students", icon: <BookOpen className="w-4 h-4" /> },
  { id: "teachers", label: "Teachers", icon: <Users className="w-4 h-4" /> },
  {
    id: "fieldexecs",
    label: "Field Executives",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: "demos",
    label: "Demo Bookings",
    icon: <CalendarCheck className="w-4 h-4" />,
  },
  { id: "contacts", label: "Contacts", icon: <Mail className="w-4 h-4" /> },
  {
    id: "blog",
    label: "Blog / Pragati",
    icon: <Newspaper className="w-4 h-4" />,
  },
];

const EMPTY_POST: Omit<BlogPost, "publishedAt"> = {
  title: "",
  content: "",
  excerpt: "",
  authorName: "",
  category: "Education",
};

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const { data: profile } = useCallerProfile();
  const { data: students } = useAllStudents();
  const { data: teachers } = useAllTeachers();
  const { data: fieldExecs } = useAllFieldExecs();
  const { data: demos } = useDemoBookings();
  const { data: contacts } = useContactSubmissions();
  const { data: blogPosts } = useBlogPosts();
  const { mutateAsync: saveBlog, isPending: savingBlog } =
    useCreateOrUpdateBlogPost();

  const [blogForm, setBlogForm] =
    useState<Omit<BlogPost, "publishedAt">>(EMPTY_POST);
  const [editId, setEditId] = useState<bigint | null>(null);

  const formatDate = (ts: bigint) =>
    new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN");

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) {
      toast.error("Title and content are required.");
      return;
    }
    try {
      await saveBlog({
        id: editId,
        post: {
          ...blogForm,
          publishedAt: BigInt(Date.now()) * BigInt(1_000_000),
        },
      });
      toast.success(editId !== null ? "Post updated!" : "Post published!");
      setBlogForm(EMPTY_POST);
      setEditId(null);
    } catch {
      toast.error("Failed to save post.");
    }
  };

  return (
    <DashboardLayout
      title="Admin Panel"
      subtitle="Admin Portal"
      items={ITEMS}
      activeItem={active}
      onItemClick={setActive}
    >
      {active === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="font-poppins font-bold text-2xl text-foreground">
              Welcome, {profile?.name ?? "Admin"}!
            </h2>
            <p className="text-muted-foreground mt-1">
              Full platform control and analytics.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Students",
                value: String(students?.length ?? 0),
                icon: BookOpen,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Teachers",
                value: String(teachers?.length ?? 0),
                icon: Users,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Field Executives",
                value: String(fieldExecs?.length ?? 0),
                icon: MapPin,
                color: "bg-purple-50 text-purple-600",
              },
              {
                label: "Demo Bookings",
                value: String(demos?.length ?? 0),
                icon: CalendarCheck,
                color: "bg-orange-50 text-orange-600",
              },
              {
                label: "Contact Msgs",
                value: String(contacts?.length ?? 0),
                icon: Mail,
                color: "bg-teal-50 text-teal-600",
              },
              {
                label: "Blog Posts",
                value: String(blogPosts?.length ?? 0),
                icon: Newspaper,
                color: "bg-rose-50 text-rose-600",
              },
            ].map((s, i) => (
              <Card
                key={s.label}
                className="shadow-card border-border"
                data-ocid={`admin.card.${i + 1}`}
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

      {active === "students" && (
        <div className="animate-fade-in">
          <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
            All Students ({students?.length ?? 0})
          </h2>
          {students?.length ? (
            <Card className="shadow-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Exams</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s, i) => (
                    <TableRow
                      key={`stu-${s.name}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.gradeLevel}</TableCell>
                      <TableCell>
                        {
                          s.attendance.filter((a) => a.status === "present")
                            .length
                        }
                        /{s.attendance.length}
                      </TableCell>
                      <TableCell>{s.examResults.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="shadow-card border-border">
              <CardContent
                className="pt-8 pb-8 text-center"
                data-ocid="admin.empty_state"
              >
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No students yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {active === "teachers" && (
        <div className="animate-fade-in">
          <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
            All Teachers ({teachers?.length ?? 0})
          </h2>
          {teachers?.length ? (
            <Card className="shadow-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Schedule</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((t, i) => (
                    <TableRow
                      key={`tch-${t.name}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.subjects.join(", ") || "—"}</TableCell>
                      <TableCell>{t.schedule.length} classes</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="shadow-card border-border">
              <CardContent
                className="pt-8 pb-8 text-center"
                data-ocid="admin.empty_state"
              >
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No teachers yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {active === "fieldexecs" && (
        <div className="animate-fade-in">
          <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
            Field Executives ({fieldExecs?.length ?? 0})
          </h2>
          {fieldExecs?.length ? (
            <Card className="shadow-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Check-ins</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldExecs.map((f, i) => (
                    <TableRow
                      key={`fe-${f.name}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell>{f.leads.length}</TableCell>
                      <TableCell>{f.checkIns.length}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="shadow-card border-border">
              <CardContent
                className="pt-8 pb-8 text-center"
                data-ocid="admin.empty_state"
              >
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No field executives yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {active === "demos" && (
        <div className="animate-fade-in">
          <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
            Demo Bookings ({demos?.length ?? 0})
          </h2>
          {demos?.length ? (
            <Card className="shadow-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Booked On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demos.map((d, i) => (
                    <TableRow
                      key={`demo-${d.email}-${i}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.email}</TableCell>
                      <TableCell>{d.phone}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          {d.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(d.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="shadow-card border-border">
              <CardContent
                className="pt-8 pb-8 text-center"
                data-ocid="admin.empty_state"
              >
                <CalendarCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No demo bookings yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {active === "contacts" && (
        <div className="animate-fade-in">
          <h2 className="font-poppins font-bold text-xl text-foreground mb-4">
            Contact Messages ({contacts?.length ?? 0})
          </h2>
          {contacts?.length ? (
            <Card className="shadow-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c, i) => (
                    <TableRow
                      key={`cnt-${c.email}-${i}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{c.message}</p>
                      </TableCell>
                      <TableCell>{formatDate(c.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <Card className="shadow-card border-border">
              <CardContent
                className="pt-8 pb-8 text-center"
                data-ocid="admin.empty_state"
              >
                <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No contact messages yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {active === "blog" && (
        <div className="animate-fade-in space-y-6">
          <h2 className="font-poppins font-bold text-xl text-foreground">
            Blog / Pragati Magazine
          </h2>

          {/* Form */}
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-poppins text-base">
                {editId !== null ? "Edit Post" : "New Blog Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="blog-title">Title *</Label>
                    <Input
                      id="blog-title"
                      placeholder="Post title"
                      value={blogForm.title}
                      onChange={(e) =>
                        setBlogForm((p) => ({ ...p, title: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="blog-author">Author Name</Label>
                    <Input
                      id="blog-author"
                      placeholder="Author"
                      value={blogForm.authorName}
                      onChange={(e) =>
                        setBlogForm((p) => ({
                          ...p,
                          authorName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={blogForm.category}
                      onValueChange={(v) =>
                        setBlogForm((p) => ({ ...p, category: v }))
                      }
                    >
                      <SelectTrigger className="mt-1" data-ocid="admin.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Education", "Exams", "Skills", "News"].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="blog-excerpt">Excerpt</Label>
                    <Input
                      id="blog-excerpt"
                      placeholder="Short description"
                      value={blogForm.excerpt}
                      onChange={(e) =>
                        setBlogForm((p) => ({ ...p, excerpt: e.target.value }))
                      }
                      className="mt-1"
                      data-ocid="admin.input"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="blog-content">Content *</Label>
                    <Textarea
                      id="blog-content"
                      placeholder="Full post content..."
                      rows={5}
                      value={blogForm.content}
                      onChange={(e) =>
                        setBlogForm((p) => ({ ...p, content: e.target.value }))
                      }
                      className="mt-1 resize-none"
                      data-ocid="admin.textarea"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={savingBlog}
                    className="rounded-full bg-primary text-white"
                    data-ocid="admin.submit_button"
                  >
                    {savingBlog ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : editId !== null ? (
                      "Update Post"
                    ) : (
                      "Publish Post"
                    )}
                  </Button>
                  {editId !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setEditId(null);
                        setBlogForm(EMPTY_POST);
                      }}
                      data-ocid="admin.cancel_button"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing posts */}
          {blogPosts?.length ? (
            <Card className="shadow-card border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((p, i) => (
                    <TableRow
                      key={`bp-${p.title.slice(0, 20)}-${i}`}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <p className="truncate">{p.title}</p>
                      </TableCell>
                      <TableCell>{p.authorName}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700">
                          {p.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(p.publishedAt)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary"
                          onClick={() => {
                            setEditId(BigInt(i));
                            setBlogForm({
                              title: p.title,
                              content: p.content,
                              excerpt: p.excerpt,
                              authorName: p.authorName,
                              category: p.category,
                            });
                            setActive("blog");
                          }}
                          data-ocid="admin.edit_button"
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
            <div
              className="text-center text-muted-foreground py-6"
              data-ocid="admin.empty_state"
            >
              No blog posts yet. Create your first post above!
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
