"use client";
// The place where we synchronise the URL with the SearchBar Imput field
// And some more logic to make the search functionality work

import { Loader2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

{/* Getting the search params into our SearchBar component - Target is due to routing to put the search query into the URL:*/}

const SearchBar = () => {
  const searchParams = useSearchParams()
  const defaultQuery = searchParams.get('query') || ''
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSearching, startTransition] = useTransition()
  const router = useRouter()
  const [query, setQuery] = useState<string>(defaultQuery)

  {/* Search functionality => Pushing the search query into the URL thanks to the router above */}
  const search = () => { 
    startTransition(() => {
      router.push(`/search?query=${query}`)
    })


  }


  {/* SearchBar component + Button component */}
  

  return(
    <div className="relative w-full h-14 flex flex-col bg-white">
      <div className="relative h-14 z-10 rounded-md">
        {/* This key element will keep the text in the searchbar even though the user hits esc */}
        {/* Same goes when the user hits ENTER to trigger the search functionality */}
        {/* The user can also click the SEARCH BUTTON to trigger the search functionality */}
        <Input 
        disabled={isSearching}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            search()
          }

          if (e.key === 'Escape') {
            inputRef.current?.blur()
          }

        }} ref={inputRef} className='absolute inset-0 h-full' />
  
        {/* Same same goes with the user when he doesnt click ENTER but the SEARCH BUTTON to trigger the search functionality */}
        <Button
        disabled={isSearching}
        size={'sm'}
        onClick={search} 
        className='absolute right-0 inset-y-0 h-full rounded-1-none'>
          {isSearching ? <Loader2 className='h-6 w-6' /> :
          <Search className='h-7 w-7' />}

        </Button>

      </div>
    </div>

  )


}

export default SearchBar;