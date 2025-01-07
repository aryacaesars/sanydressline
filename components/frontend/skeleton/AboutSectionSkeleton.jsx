import { Skeleton } from "@/components/ui/skeleton";

const AboutSectionSkeleton = () => {
  return (
    <section className="container md:px-20 mx-auto md:my-28 flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-10 gap-40 overflow-hidden">
      <div className="flex-1 order-1 md:order-1 md:ml-2">
        <Skeleton className="rounded-2xl w-[280px] h-[380px] lg:w-[340px] lg:h-[480px] rounded-tl-[70px] rounded-br-[70px] lg:rounded-tl-[100px] lg:rounded-br-[100px] rounded-tr-md rounded-bl-md mb-6 lg:mb-0 shadow-[0_8px_25px_rgba(0,0,0,0.6)] object-cover transition-opacity duration-500" />
      </div>
      <div className="flex-1 order-2 md:order-1 md:-ml-60">
        <Skeleton className="h-10 w-[300px] mb-4" />
        <Skeleton className="h-6 w-[500px] mb-6 max-w-xl" />
        <Skeleton className="h-6 w-[400px] mb-6 max-w-xl" />
        <Skeleton className="h-6 w-[300px] mb-6 max-w-xl" />
      </div>
    </section>
  );
};

export default AboutSectionSkeleton;