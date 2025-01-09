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
import Image from "next/image";
import logo from "../public/logo.svg";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 via-green-400 to-green-700 px-4">
      <Card className="w-full max-w-md p-6 md:p-10 lg:p-20 bg-white shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-2">
          <Image
            className="mx-auto mb-4"
            src={logo}
            priority={true}
            alt="SanyDressline Logo"
            width={120}
            height={80}
          />
          <CardTitle className="text-xl font-bold text-green-800">Hi!</CardTitle>
          <CardDescription className="text-sm text-green-900">
            Please login to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginLink>
            <Button className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 ">
              Login
            </Button>
          </LoginLink>
        </CardContent>
      </Card>
    </div>
  );
}
