import ApplianceManager from "@/components/ApplianceManager";

export const metadata = {
  title: "My Kitchen — Kosher Star Kitchen",
};

export default function AppliancesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-6 sm:p-8">
        <ApplianceManager />
      </div>
    </div>
  );
}
