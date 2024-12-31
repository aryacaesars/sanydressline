// components/frontend/skeleton/ProductSkeleton.jsx
import {Skeleton} from "@/components/ui/skeleton";

const ProductSkeleton = () => {
    return (
        <div className="w-full overflow-hidden bg-white shadow-lg rounded-lg">
            <Skeleton className="h-48 sm:h-64 w-full"/>
            <div className="p-2 sm:p-4">
                <Skeleton className="h-6 w-3/4 mb-2"/>
                <Skeleton className="h-6 w-1/2 mb-2"/>
                <Skeleton className="h-4 w-full mb-2"/>
                <Skeleton className="h-4 w-5/6 mb-2"/>
                <Skeleton className="h-4 w-2/3 mb-2"/>
            </div>
            <div className="p-2 sm:p-4 bg-gray-50">
                <Skeleton className="h-10 w-full"/>
            </div>
        </div>
    );
};

export default ProductSkeleton;