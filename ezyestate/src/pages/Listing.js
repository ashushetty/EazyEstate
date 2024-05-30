import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import{Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation} from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing,setListing]= useState(null);
    const [loading,setLoading]= useState(false);
    const [error,setError]= useState(false);
    const params = useParams();
    useEffect(() =>{
        const fetchListing = async()=>{
            try{
                setLoading(true);
                const res= await fetch(`http://localhost:4000/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false)
                    return;

                }
                setListing(data);
                setLoading(false);
                setError(false);

            }catch(err){
                setError(true);
                setLoading(false);

            }
           

        };
       fetchListing();
    },[params.listingId]);
    console.log(error)
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7'>Something went wrong</p>}
        {listing && listing.responseData && !loading && !error &&(
            <>
            <Swiper navigation>
                {listing.responseData.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <div className=' h-[500px]' style={{background:`url(${url})center no-repeat` ,backgroundSize:'cover'}}></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            </>
        )}
    </main>
  )
}
