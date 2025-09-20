import { SignedIn, SignedOut, SignIn, SignOutButton } from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>
    </div>
  )
}

export default HomePage