import Link from "next/link";
import Wizard from "@/components/wizard";

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </svg>
  );
}

export const metadata = {
  title: "Build — Eve Wizard",
  description: "Configure and scaffold your Eve AI agent",
};

export default function BuildPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8 flex items-center gap-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white text-sm font-medium transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeftIcon />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight font-mono">
              eve<span className="text-neutral-500">.</span>wizard
            </h1>
            <p className="text-xs text-neutral-600 mt-0.5">Scaffold your Eve agent</p>
          </div>
        </div>

        <Wizard />

      </div>
    </div>
  );
}
