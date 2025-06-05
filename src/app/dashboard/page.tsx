import ProductionDashboard from "./dashboard-page";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProductionDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login"); // Redirect if no session
  }

  return <ProductionDashboard />;
}
