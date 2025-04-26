export function PreviewFrame({ url }: { url: string }) {
  return (
    <div className='min-h-screen'>
      <iframe
        className='min-h-screen w-full'
        src={url}
      />
    </div>
  );
}
