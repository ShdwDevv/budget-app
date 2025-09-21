import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import SignInWatcher from "./_components/SignInWatcher";
export default function Home() {
  return (
    <div>
      <SignInWatcher></SignInWatcher>
      <Header></Header>
      <Hero/>
    </div>
  );
}
