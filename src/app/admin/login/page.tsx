import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/inputs";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/admin",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect("/admin/login?error=1");
      }
      throw err;
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <h1 className="text-lg font-bold text-navy">Admin Login</h1>
        <form action={login} className="mt-6 flex flex-col gap-4">
          <Field label="Email" htmlFor="email" required>
            <Input id="email" name="email" type="email" required />
          </Field>
          <Field label="Password" htmlFor="password" required>
            <Input id="password" name="password" type="password" required />
          </Field>
          {error ? (
            <p className="text-sm font-medium text-red-600">
              Invalid email or password.
            </p>
          ) : null}
          <Button type="submit">Sign In</Button>
        </form>
      </Card>
    </div>
  );
}
