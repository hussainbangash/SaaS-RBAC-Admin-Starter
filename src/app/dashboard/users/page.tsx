import { prisma } from "@/lib/prisma";
import { requireRole, roleLabels } from "@/lib/permissions/roles";

export default async function UsersPage() {
  await requireRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-slate-500">
          Admin only
        </p>
        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          User Management
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Only Admin users can access this page.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {user.name ?? "Unnamed user"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {user.createdAt.toLocaleDateString("en-US")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}