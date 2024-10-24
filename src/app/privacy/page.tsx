export function generateMetadata() {
  return {
    title: "Privacy Policy",
    description:
      "Binderview.com does not store any user data. No cookies are used and user authentication is not supported.",
    openGraph: {
      images: ["/scarlet-violet-screenshot.jpg"],
    },
  };
}

export default function Privacy() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex flex-col items-center gap-10 p-10">
      <h1 className="text-2xl">Privacy Policy</h1>

      <p>
        Binderview.com does not store any user data. No cookies are used and
        user authentication is not supported.
      </p>
    </div>
  );
}
