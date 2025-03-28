import { Metadata } from "next";
import dynamic from "next/dynamic";

const BindersComponent = dynamic(() => import("@/components/Binders"), {
  // ssr: false,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Digital Binder View",
    description:
      "Organize your favorite cards with digital binders! This is a great way to experience the Pokemon TCG. Free & No login required.",
    applicationName: "BinderView",
    openGraph: {
      images: ["/screenshots/binder-page.jpg"],
      title: "Digital Binder View",
      description:
        "Organize your favorite cards with digital binders! This is a great way to experience the Pokemon TCG. Free & No login required.",
      siteName: "BinderView",
    },
  };
}

export default function BindersPage() {
  return (
    <>
      <div className="text-center mx-auto p-8 mb-4 font-geist-sans text-white bg-gradient-to-br from-indigo-500 to-blue-600">
        <h1 className="text-3xl font-bold mb-4">Binders</h1>
        <p>Organize your Favorite Cards with Digital Binders</p>
      </div>

      <BindersComponent />
    </>
  );
}
