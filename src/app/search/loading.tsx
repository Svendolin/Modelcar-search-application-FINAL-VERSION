/* React Suspense is a new feature in React 16.6 that allows you to suspend rendering while data is loading.
This is especially useful for server-side rendering, but it can also be useful for loading data in the browser. 
Suspense is a component that you can wrap around any component that may have asynchronous data dependencies. When Suspense is used, React will wait until all of the data dependencies are resolved before rendering the component. If the data dependencies are not resolved within a certain time frame, React will show a fallback UI until the data is resolved. 
This is useful for showing a loading spinner or other loading indicator while data is loading. */

// => After we enter a search term and click Enter, the loading animation is displayed while the data is being loaded.

export default function Loading() {
  return (
    <ul className='py-4 divide-y divide-gray-200 bg-white shadow-md rounded-b-md'>
      {new Array(3).fill(null).map((_, i) => ( // Null because we dont care what's in the array but rather the length of it
        <li // Leading state of line 13 has the same size as the image for a better UI
          key={i}
          className='mx-auto py-4 w-full px-8 animate-pulse flex space-x-4'>
          <div className='rounded-lg bg-gray-300 h-40 w-40' /> 
          <div className='w-full flex-1 space-y-4 py-1'>
            <div className='h-10 bg-gray-300 rounded w-full' />
            <div className='space-y-2'>
              <div className='h-4 bg-gray-300 rounded w-4/5' />
              <div className='h-4 bg-gray-300 rounded w-4/5' />
              <div className='h-4 bg-gray-300 rounded w-4/5' />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
