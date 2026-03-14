"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, isSuperAdmin } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    router.push("/projects");
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
