import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
  return (
    <section className="container max-w-7xl min-h-screen mx-auto my-16 md:my-16 flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-10 gap-6 md:gap-40 overflow-hidden">
      <div className="flex-1">
        <Skeleton className="h-10 w-[400px] mb-4" />
          <Skeleton className="h-10 w-[200px] mb-4" />
        <Skeleton className="h-6 w-[500px] mb-4" />
          <Skeleton className="h-6 w-[500px] mb-4" />
          <Skeleton className="h-6 w-[400px] mb-4" />
          <Skeleton className="h-6 w-[400px] mb-4" />
          <Skeleton className="h-6 w-[300px] mb-4" />
        <Skeleton className="h-12 w-[150px] rounded-md" />
      </div>
      <div className="flex-1 flex justify-center">
        <Skeleton className="h-[380px] w-[280px] md:h-[380px] md:w-[280px] lg:h-[480px] lg:w-[340px] rounded-tl-[70px] shadow-md rounded-br-[70px] lg:rounded-tl-[100px] lg:rounded-br-[100px] rounded-tr-md rounded-bl-md mx-auto mb-6 lg:mb-0 lg:ml-[160px] shadow-[0_8px_25px_rgba(0,0,0,0.6)] object-cover transition-opacity duration-500" />
      </div>
    </section>
  );
};

export default HeroSkeleton;