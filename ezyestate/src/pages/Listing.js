import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import{Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation]);

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:4000/api/listing/get/${params.listingId}`);
                const data = await res.json();

                if (data.success === false || !data.responseData) {
                    setError(true);
                } else {
                    setListing(data);
                }

                setLoading(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };

        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7'>Something went wrong</p>}
            {listing && listing.responseData && (
                <>
                    <Swiper navigation>
                        {listing.responseData.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[500px]' style={{ background: `url(${url})center no-repeat`, backgroundSize: 'cover' }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='flex flex-col items-center px-4 w-full max-w-xl mx-auto gap-2'>
                        <p className='text-3xl  my-7 text-left w-full'>
                            {listing.responseData.name} - $
                            {listing.responseData.offer
                                ? listing.responseData.discountedPrice.toLocaleString('en-US')
                                : listing.responseData.regularPrice.toLocaleString('en-US')}
                            {listing.responseData.type === 'rent' && '/month'}
                        </p>
                        <p className='flex items-center gap-2 text-slate-600 my-2 text-sm w-full text-left'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.responseData.address}
                        </p>
                        <div className='flex gap-3 w-full text-left'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1  rounded-md'>
                                {listing.responseData.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.responseData.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1  rounded-md'>
                                    ${listing.responseData.regularPrice - listing.responseData.discountedPrice}
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800 text-left w-full'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.responseData.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6  w-full text-left'>
                            <li className='flex items-center gap-1'>
                                <FaBed className='text-lg' />
                                {listing.responseData.bedrooms > 1 ? `${listing.responseData.bedrooms} beds` : `${listing.responseData.bedrooms} bed`}
                            </li>
                            <li className='flex items-center gap-1'>
                                <FaBath className='text-lg' />
                                {listing.responseData.bathrooms > 1 ? `${listing.responseData.bathrooms} baths` : `${listing.responseData.bathrooms} bath`}
                            </li>
                            <li className='flex items-center gap-1'>
                                <FaParking className='text-lg' />
                                {listing.responseData.parking ? 'Parking spot' : 'No parking'}
                            </li>
                            <li className='flex items-center gap-1'>
                                <FaChair className='text-lg' />
                                {listing.responseData.furnished ? 'Furnished' : 'Not furnished'}
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </main>
    );
}