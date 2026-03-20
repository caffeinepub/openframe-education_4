import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitDemoBooking } from "../hooks/useQueries";

interface BookDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookDemoModal({
  open,
  onOpenChange,
}: BookDemoModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "",
    preferredTime: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitDemoBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.grade) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      const preferredTs = form.preferredTime
        ? BigInt(new Date(form.preferredTime).getTime()) * BigInt(1_000_000)
        : BigInt(Date.now()) * BigInt(1_000_000);
      await mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        grade: form.grade,
        preferredTime: preferredTs,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      });
      setSubmitted(true);
      toast.success("Demo booked! We'll contact you shortly.");
    } catch {
      toast.error("Failed to book demo. Please try again.");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", grade: "", preferredTime: "" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-ocid="book_demo.dialog">
        <DialogHeader>
          <DialogTitle className="font-poppins text-xl font-bold text-foreground">
            Book Your Free Demo Class
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in your details and we'll schedule a free demo class for you.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-poppins font-semibold text-foreground text-lg">
                Demo Booked!
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Our team will call you within 24 hours to confirm.
              </p>
            </div>
            <Button
              className="rounded-full bg-primary text-primary-foreground"
              onClick={handleClose}
              data-ocid="book_demo.close_button"
            >
              Great, Thanks!
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="demo-name">Full Name *</Label>
                <Input
                  id="demo-name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid="book_demo.input"
                />
              </div>
              <div>
                <Label htmlFor="demo-email">Email *</Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid="book_demo.input"
                />
              </div>
              <div>
                <Label htmlFor="demo-phone">Phone *</Label>
                <Input
                  id="demo-phone"
                  placeholder="+91 xxxxx xxxxx"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid="book_demo.input"
                />
              </div>
              <div className="col-span-2">
                <Label>Grade/Class *</Label>
                <Select
                  onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}
                >
                  <SelectTrigger className="mt-1" data-ocid="book_demo.select">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Nursery",
                      "LKG",
                      "UKG",
                      "Class 1–5",
                      "Class 6–10",
                      "Class 11–12",
                    ].map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="demo-time">Preferred Time</Label>
                <Input
                  id="demo-time"
                  type="datetime-local"
                  value={form.preferredTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, preferredTime: e.target.value }))
                  }
                  className="mt-1"
                  data-ocid="book_demo.input"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-primary text-primary-foreground font-semibold"
              data-ocid="book_demo.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking…
                </>
              ) : (
                "Book Free Demo"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
