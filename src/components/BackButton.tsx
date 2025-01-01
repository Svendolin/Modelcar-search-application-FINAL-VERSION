'use client'

//  BackButton is a component which should happen on the client side because we put some interactivity in there.

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

const BackButton = () => {
  const router = useRouter()
  return (
    // from our UI ShadCN library, we are using the Button component.
    <Button
      onClick={() => router.back()} // Keeps the cache between navigation for each page transitions.
      className='flex gap-2 items-center text-sm pb-2'
      variant='secondary'>
      <ChevronLeft className='h-4 w-4' />
      Back
    </Button>
  )
}

export default BackButton