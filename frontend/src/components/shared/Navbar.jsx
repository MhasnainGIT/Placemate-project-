import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
                setIsMobileMenuOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    const isActiveLink = (path) => {
        return location.pathname === path;
    }

    const getNavigationLinks = () => {
        if (!user) {
            return [
                { to: "/", label: "Home" },
                { to: "/jobs", label: "Jobs" },
                { to: "/browse", label: "Browse" }
            ];
        }

        if (user.role === 'student') {
            return [
                { to: "/", label: "Home" },
                { to: "/jobs", label: "Jobs" },
                { to: "/browse", label: "Browse" },
                { to: "/dashboard/student", label: "My Dashboard" }
            ];
        }

        if (user.role === 'recruiter') {
            return [
                { to: "/admin/companies", label: "Companies" },
                { to: "/admin/jobs", label: "Jobs" },
                { to: "/dashboard/recruiter", label: "Recruiter Dashboard" }
            ];
        }

        if (user.role === 'placement_cell_staff') {
            return [
                { to: "/dashboard/placement", label: "Placement Dashboard" }
            ];
        }

        return [];
    }

    const navigationLinks = getNavigationLinks();

    return (
        <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                {/* Logo */}
                <div className="flex-shrink-0">
                    <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
                        <h1 className='text-2xl font-bold'>
                            Place<span className='text-[#F83002]'>mate</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center space-x-8'>
                    <ul className='flex font-medium items-center space-x-6'>
                        {navigationLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`text-gray-700 hover:text-[#F83002] transition-colors duration-200 py-2 px-1 relative ${isActiveLink(link.to)
                                            ? 'text-[#F83002] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F83002]'
                                            : ''
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Auth Section */}
                    {!user ? (
                        <div className='flex items-center space-x-3'>
                            <Link to="/login">
                                <Button variant="outline" className="border-gray-300 hover:border-[#F83002] hover:text-[#F83002]">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer h-9 w-9 ring-2 ring-transparent hover:ring-[#F83002] transition-all duration-200">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 mr-4">
                                <div className="space-y-4">
                                    <div className='flex gap-3 items-start'>
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className='font-medium text-gray-900 truncate'>
                                                {user?.fullName || user?.fullname}
                                            </h4>
                                            <p className='text-sm text-gray-600 truncate'>
                                                {user?.email}
                                            </p>
                                            {user?.profile?.bio && (
                                                <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
                                                    {user.profile.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='border-t pt-3 space-y-2'>
                                        {user?.role === 'student' && (
                                            <Link to="/profile" className='w-full'>
                                                <Button variant="ghost" className='w-full justify-start text-gray-700 hover:text-[#F83002] hover:bg-gray-50'>
                                                    <User2 className="h-4 w-4 mr-2" />
                                                    View Profile
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            onClick={logoutHandler}
                                            variant="ghost"
                                            className='w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50'
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center space-x-2">
                    {user && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                        </Avatar>
                    )}
                    <button
                        onClick={toggleMobileMenu}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#F83002] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F83002]"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMobileMenuOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={closeMobileMenu}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveLink(link.to)
                                        ? 'text-[#F83002] bg-red-50'
                                        : 'text-gray-700 hover:text-[#F83002] hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Auth Section */}
                        <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                            {!user ? (
                                <div className='flex flex-col space-y-2 px-3'>
                                    <Link to="/login" onClick={closeMobileMenu}>
                                        <Button variant="outline" className="w-full border-gray-300 hover:border-[#F83002] hover:text-[#F83002]">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={closeMobileMenu}>
                                        <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                                            Signup
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="px-3 space-y-2">
                                    <div className="flex items-center space-x-3 py-2">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@user" />
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user?.fullName || user?.fullname}
                                            </p>
                                            <p className="text-sm text-gray-600 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    {user?.role === 'student' && (
                                        <Link to="/profile" onClick={closeMobileMenu}>
                                            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-[#F83002] hover:bg-gray-50">
                                                <User2 className="h-4 w-4 mr-2" />
                                                View Profile
                                            </Button>
                                        </Link>
                                    )}
                                    <Button
                                        onClick={logoutHandler}
                                        variant="ghost"
                                        className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar