import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import HeroSection from "@/components/frontend/HeroSection";
import Products from "../../components/frontend/Product";

export default function Home() {
  return (
    <div>
      {/*<h1>Home</h1>*/}
      {/*<Button>*/}
      {/*  <LoginLink>Sign in</LoginLink>*/}
      {/*</Button>*/}
      <HeroSection/>
      <Products/>
    </div>
  );
}
