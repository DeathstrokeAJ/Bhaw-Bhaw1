import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSelectedService } from '@/redux/serviceSlice';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/services/getAllServices')
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
        Our <span className="text-pink-500">Services</span>
      </h1>
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-1/4 bg-white p-6 shadow-lg rounded-lg mb-6 md:mb-0 md:mr-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Categories</h2>
          <ul className="space-y-3">
            <li className="py-2 cursor-pointer hover:text-pink-500 font-medium">Pet Grooming</li>
            <li className="py-2 cursor-pointer hover:text-pink-500 font-medium">Pet Cleaning</li>
            <li className="py-2 cursor-pointer hover:text-pink-500 font-medium">Training</li>
            {/* Add more categories as needed */}
          </ul>
        </aside>
        <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.serviceID || index} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service }) {
    const dispatch = useDispatch();
    const router = useRouter();
  
    const handleBookNow = () => {
      dispatch(setSelectedService(service));
      router.push('/book-service');
    };
  
  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col relative">
      <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold rounded-full px-2 py-1">
        Popular
      </span>
      <img
        src={service.image || "https://via.placeholder.com/150"} // Default image if not available
        alt={service.title}
        className="w-full h-56 object-cover rounded-lg"
      />
      <div className="mt-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{service.address}</p>
        <p className="text-lg font-semibold mt-2 text-green-600">Rs {service.pricePerHour}/hr</p>
        <div className="flex items-center mt-3 text-yellow-500">
          {'⭐'.repeat(4)} {/* Placeholder rating */}
          <span className="text-gray-500 text-xs ml-1">(21)</span>
        </div>
        <button onClick={handleBookNow} className="mt-4 w-full bg-pink-500 text-white text-sm py-2 rounded-lg hover:bg-pink-600 transition-colors">
          Book Now
        </button>
      </div>
    </div>
  );
}
