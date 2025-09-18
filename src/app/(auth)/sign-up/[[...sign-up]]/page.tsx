import React from 'react'
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
  <main className="flex h-screen w-full items-center justify-center">
    <SignUp routing="hash" />
  </main>
  )
}

export default SignUpPage