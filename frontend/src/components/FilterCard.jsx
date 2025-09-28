import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Filter, MapPin, Code, DollarSign, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from './ui/button'

// --- FILTER DATA DEFINITION ---
// Defines the structure and content for each collapsible filter group (accordion item).
const filterData = [
    {
        filterKey: "location", // Unique key for state tracking
        title: "Location",
        icon: MapPin,
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"]
    },
    {
        filterKey: "industry",
        title: "Industry",
        icon: Code,
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "DevOps", "Data Scientist"]
    },
    {
        filterKey: "salary",
        title: "Annual Salary (LPA)",
        icon: DollarSign,
        array: ["0-4L", "4L-8L", "8L-15L", "15L+"]
    },
]

// Initial state structure for multi-criteria filtering.
const initialFilters = {
    location: '',
    industry: '',
    salary: '',
};

const FilterCard = ({ isOpen, onClose }) => {
    // State 1: Holds the currently selected value for each filter category (e.g., {location: 'Remote'}).
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);
    
    // State 2: Controls which accordion filter section is currently open (desktop/mobile).
    const [openFilterKey, setOpenFilterKey] = useState(filterData[0].filterKey);
    const dispatch = useDispatch();

    // Derived State: Calculates the number of filters actively applied.
    const activeFilterCount = Object.values(selectedFilters).filter(val => val !== '').length;

    // Handler for RadioGroup selection within any filter section.
    const changeHandler = (filterKey, value) => {
        // Updates the selected value for the specific filter category (filterKey).
        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
        // Closes the accordion section after a selection is made (improves UX).
        setOpenFilterKey(null);
    };

    // Resets all filters to their initial, empty state.
    const clearFilters = () => {
        setSelectedFilters(initialFilters);
        // Dispatches an empty query to trigger job list reset.
        dispatch(setSearchedQuery(''));
    }

    // Effect: Synchronizes the filter state with the Redux store's search query.
    useEffect(() => {
        // Extracts and joins all active filter values into a single search string.
        const queryParts = Object.values(selectedFilters).filter(val => val !== '');
        const combinedQuery = queryParts.join(' '); // Example: "Delhi NCR Frontend Developer"

        // Dispatches the combined string query for job list filtering.
        dispatch(setSearchedQuery(combinedQuery));
    }, [selectedFilters, dispatch]);


    // --- FILTER SECTION COMPONENT (Accordion Item) ---
    // Renders an individual, collapsible filter group (Location, Industry, or Salary).
    const FilterSection = ({ data, selectedValue, onChange }) => {
        const IconComponent = data.icon;
        const isOpen = openFilterKey === data.filterKey;

        // Check if any value is selected in this specific filter group.
        const isSelected = selectedValue !== '';

        return (
            <div
                className={`w-full transition-all duration-300 ease-in-out border border-gray-200 rounded-lg overflow-hidden ${isSelected ? 'shadow-md border-indigo-300' : 'hover:border-indigo-100'}`}
            >
                {/* Accordion Header/Trigger: Controls the visibility of filter options */}
                <div
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setOpenFilterKey(isOpen ? null : data.filterKey)} // Toggle accordion state
                >
                    <div className="flex items-center space-x-3">
                        <IconComponent className={`h-5 w-5 transition-colors ${isSelected ? 'text-[#6A38C2]' : 'text-gray-500'}`} />
                        <h3 className={`font-semibold text-base ${isSelected ? 'text-[#6A38C2]' : 'text-gray-900'}`}>{data.title}</h3>
                        {isSelected && <span className='text-xs font-medium text-[#6A38C2] bg-indigo-100 rounded-full px-2 py-0.5'>Selected</span>}
                    </div>
                    {/* Chevron icon indicating whether the section is open or closed */}
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </div>

                {/* Filter Options Content Area (Collapsible) */}
                <div
                    // Uses max-height for CSS transition-based collapsing effect
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0'}`}
                >
                    <RadioGroup
                        value={selectedValue}
                        onValueChange={(value) => onChange(data.filterKey, value)} // Call the main change handler
                        className="space-y-3"
                    >
                        {data.array.map((item, idx) => {
                            const itemId = `${data.filterKey}-${idx}`;
                            return (
                                <div key={itemId} className='flex items-center space-x-3'>
                                    <RadioGroupItem
                                        value={item}
                                        id={itemId}
                                        className="text-[#6A38C2] focus:ring-[#6A38C2] border-gray-300"
                                    />
                                    <Label
                                        htmlFor={itemId}
                                        className="text-sm text-gray-700 cursor-pointer flex-1 hover:text-gray-900 transition-colors"
                                    >
                                        {item}
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Desktop Filter Card (Hidden on mobile) */}
            <div className='hidden lg:block w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>

                {/* Desktop Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-5 w-5 text-[#6A38C2]" />
                            <h2 className='font-bold text-lg text-gray-900'>
                                Filters <span className='text-sm font-medium text-gray-500'>({activeFilterCount} Active)</span>
                            </h2>
                        </div>
                        {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-[#6A38C2] hover:bg-indigo-50 p-2"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Desktop Filter Sections Container */}
                <div className="p-4 space-y-3">
                    {filterData.map((data) => (
                        <FilterSection
                            key={data.filterKey}
                            data={data}
                            selectedValue={selectedFilters[data.filterKey]}
                            onChange={changeHandler}
                        />
                    ))}
                    <p className="text-xs text-center text-gray-400 pt-2">Refine your search with smart filters.</p>
                </div>
            </div>

            {/* Mobile Filter Overlay (Bottom Drawer) */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                    <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the drawer
                    >
                        {/* Mobile Drawer Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
                            <div className="flex items-center justify-between">
                                <h2 className='font-bold text-xl text-gray-900'>Filter Jobs ({activeFilterCount})</h2>
                                <Button variant="ghost" size="sm" onClick={onClose} className="p-2 rounded-full">
                                    <X className="h-5 w-5 text-gray-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Filter Body (Accordion sections) */}
                        <div className="p-4 space-y-3">
                            {filterData.map((data) => (
                                <FilterSection
                                    key={data.filterKey}
                                    data={data}
                                    selectedValue={selectedFilters[data.filterKey]}
                                    onChange={changeHandler}
                                />
                            ))}
                        </div>

                        {/* Sticky Footer for Mobile Actions (Clear & Apply/Show Results) */}
                        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.1)]">
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="flex-1 text-[#6A38C2] border-[#6A38C2]/50 hover:bg-indigo-50"
                                >
                                    Clear ({activeFilterCount})
                                </Button>
                                <Button
                                    onClick={onClose}
                                    className="flex-1 bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
                                >
                                    Show Results
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FilterCard