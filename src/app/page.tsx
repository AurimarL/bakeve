import Wizard from "@/components/wizard";

export default function Page() {

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Eve Wizard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Build Eve
          </p>
        </div>
        <Wizard />
      </div>
    </div>
  );
}