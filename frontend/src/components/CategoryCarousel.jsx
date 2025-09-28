import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Code, Palette, Database, Layers, Search } from 'lucide-react';

const categories = [
    {
        name: "Frontend Developer",
        icon: Code,
        color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    },
    {
        name: "Backend Developer",
        icon: Database,
        color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
    },
    {
        name: "Data Science",
        icon: Search,
        color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
    },
    {
        name: "Graphic Designer",
        icon: Palette,
        color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
    },
    {
        name: "FullStack Developer",
        icon: Layers,
        color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
    }
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="w-full">
            {/* Desktop and Tablet View */}
            <div className="hidden sm:block">
                <Carousel className="w-full max-w-6xl mx-auto my-12 px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Explore Job Categories
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Find your perfect role across different technology domains
                        </p>
                    </div>

                    <CarouselContent className="ml-2 md:ml-4">
                        {categories.map((category, index) => {
                            const IconComponent = category.icon;
                            return (
                                <CarouselItem
                                    key={index}
                                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <div className="h-full">
                                        <Button
                                            onClick={() => searchJobHandler(category.name)}
                                            variant="outline"
                                            className={`w-full h-auto p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${category.color}`}
                                        >
                                            <div className="flex flex-col items-center space-y-3">
                                                <div className="p-3 rounded-full bg-white shadow-sm">
                                                    <IconComponent className="h-6 w-6" />
                                                </div>
                                                <span className="font-medium text-sm md:text-base text-center leading-tight">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </Button>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 md:-left-4" />
                    <CarouselNext className="right-0 md:-right-4" />
                </Carousel>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden px-4 my-12">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Explore Job Categories
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Find your perfect role
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {categories.map((category, index) => {
                        const IconComponent = category.icon;
                        return (
                            <Button
                                key={index}
                                onClick={() => searchJobHandler(category.name)}
                                variant="outline"
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${category.color}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 rounded-full bg-white shadow-sm">
                                        <IconComponent className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-base">
                                        {category.name}
                                    </span>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Horizontal scroll fallback for very small screens */}
            <div className="sm:hidden px-4 mt-8">
                <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((category, index) => {
                        const IconComponent = category.icon;
                        return (
                            <Button
                                key={`scroll-${index}`}
                                onClick={() => searchJobHandler(category.name)}
                                variant="outline"
                                className={`flex-shrink-0 px-4 py-3 rounded-full border-2 transition-all duration-200 ${category.color}`}
                            >
                                <div className="flex items-center space-x-2">
                                    <IconComponent className="h-4 w-4" />
                                    <span className="font-medium text-sm whitespace-nowrap">
                                        {category.name}
                                    </span>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default CategoryCarousel