export function generateMetadata() {
  return {
    title: "Terms of Service",
    description:
      "Binderview.com is not responsible for any wrist exhaustion from viewing lots of cards.",
  };
}

export default function TermsPage() {
  return (
    <div className="font-geist-sans flex flex-col items-center gap-10 p-10">
      <h1 className="text-2xl">Terms of Service</h1>

      <p>
        Binderview.com is not responsible for any wrist exhaustion from viewing
        lots of cards.
      </p>
    </div>
  );
}
