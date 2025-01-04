"use client";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginLink>
            <Button className="w-full mt-4">Login with Kinde</Button>
          </LoginLink>
        </CardContent>
      </Card>
    </div>
  );
}