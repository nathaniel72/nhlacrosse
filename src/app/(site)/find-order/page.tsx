import { Card } from "@/components/ui/Card";
import { FindOrderForm } from "@/components/FindOrderForm";

export const metadata = {
  title: "Find My Order",
};

export default function FindOrderPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Find My Order
        </p>
        <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
          Lost your link?
        </h1>
        <p className="mt-4 text-muted">
          Enter the email you used when you submitted your request and
          we&apos;ll send your status/pay link right back to you.
        </p>
        <Card className="mt-8">
          <FindOrderForm />
        </Card>
      </div>
    </div>
  );
}
