import { useState, type ReactNode } from "react";
import { isUnlocked } from "@/lib/adminAuth";
import AdminGate from "./AdminGate";
import AdminLayout from "./AdminLayout";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean>(() => isUnlocked());

  return (
    <main className="admin-shell">
      {unlocked ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <AdminGate onUnlock={() => setUnlocked(true)} />
      )}
    </main>
  );
}
