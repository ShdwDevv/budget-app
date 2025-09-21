"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignInWatcher() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [isSignedIn, router])

  return null
}
