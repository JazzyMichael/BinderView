import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("@/components/Binders"), {
  ssr: false,
});

export default function Collection() {
  return (
    <div className="text-center mx-auto my-10 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl mb-5">Binders</h1>
      <p>Organize your favorite cards with digital binders!</p>
      <p className="text-sm mt-5">No login required</p>
      <DynamicComponent />
    </div>
  );
}
