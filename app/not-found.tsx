import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <h1 className="text-4xl text-aubergine">Page not found</h1>
      <p className="mt-4">That path is not part of this demonstration.</p>
      <Button href="/" className="mt-6">
        Back to the start
      </Button>
    </div>
  );
}
