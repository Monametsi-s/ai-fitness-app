import { SignedIn, SignedOut, SignIn, SignOutButton } from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      
        HomePage
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  )
}

export default HomePage