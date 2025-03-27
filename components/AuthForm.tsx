"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation"; // Fixed import

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        toast.success('Account created successfully!');
        router.push('/sign-in')
      } else {
        console.log('SIGN-IN', values);
        toast.success('Signed in successfully!');
        router.push('/');
      }
      
    } catch (error) {
      console.error(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <h3 className="text-primary-100">HirePrep</h3>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email here"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password here"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        {/* Navigation Link */}
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Already have an account?"}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-primary ml-1">
            {isSignIn ? " Sign up" : " Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
