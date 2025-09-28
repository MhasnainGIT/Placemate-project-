import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let ignore = false;
        const fetchAllJobs = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery || '')}`,
                    { withCredentials: true }
                );
                if (res.data?.success && !ignore) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };
        fetchAllJobs();
        return () => { ignore = true; };
    }, [searchedQuery, dispatch]);

    return { isLoading };
}

export default useGetAllJobs