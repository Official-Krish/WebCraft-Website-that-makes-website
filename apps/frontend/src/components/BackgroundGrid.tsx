export default function GridBackgroundDemo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[50rem] w-full bg-black">
      <div
        className="absolute inset-0 [background-size:40px_40px]
          [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] w-full" />
      
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
