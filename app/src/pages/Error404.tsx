export default function Error404() {
  return (
    <div className='flex flex-col items-center justify-center min-h-full text-gray-600 bg-gray-100'>
      <h1 className='text-6xl font-semibold'>404</h1>
      <p className='mt-2 text-lg'>
        Désolé, la page que vous recherchez n'existe pas.
      </p>
    </div>
  );
}
