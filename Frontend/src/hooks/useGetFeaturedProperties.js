// frontend/src/hooks/useGetFeaturedProperties.js
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { setFeaturedProperties } from '@/redux/postSlice' // Use your existing slice

const useGetFeaturedProperties = () => {
  const dispatch = useDispatch()
  const { featuredProperties } = useSelector(store => store.post) // Match your slice name

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/properties/featured')
        dispatch(setFeaturedProperties(res.data?.properties))
      } catch (error) {
        console.error('Error fetching featured properties:', error)
      }
    }
    
     // Fetch only if featuredProperties is empty/undefined
     if (!featuredProperties?.length) {
        fetchFeatured();
      }
    }, [dispatch, featuredProperties]);

  return { featuredProperties }
}

export default useGetFeaturedProperties