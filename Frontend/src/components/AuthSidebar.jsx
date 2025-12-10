// components/AuthSidebar.jsx
import { Heart, Home, MapPin, Users, Star } from "lucide-react";

const AuthSidebar = () => {
  // Real estate focused image URLs
  const propertyImages = [
    { id: 1, likes: "1.2k", url: "https://picsum.photos/300/300?modern-home" },
    {
      id: 2,
      likes: "894",
      url: "https://picsum.photos/300/300?luxury-interior",
    },
    {
      id: 3,
      likes: "2.1k",
      url: "https://picsum.photos/300/300?penthouse-view",
    },
    {
      id: 4,
      likes: "655",
      url: "https://picsum.photos/300/300?cozy-livingroom",
    },
    {
      id: 5,
      likes: "1.8k",
      url: "https://picsum.photos/300/300?architect-design",
    },
    { id: 6, likes: "932", url: "https://picsum.photos/300/300?pool-villa" },
    {
      id: 7,
      likes: "3.4k",
      url: "https://picsum.photos/300/300?mansion-driveway",
    },
    {
      id: 8,
      likes: "1.5k",
      url: "https://picsum.photos/300/300?kitchen-design",
    },
    {
      id: 9,
      likes: "2.7k",
      url: "https://picsum.photos/300/300?mountain-cabin",
    },
  ];

  return (
    <div
      className="hidden md:flex flex-col items-center w-1/2 h-screen p-4 lg:p-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2e42bf 0%, #9142ca 50%, #d037a2 100%)",
      }}
    >
      {/* Floating Featured Property Card - Adjusted positioning */}
      <div className="absolute top-4 lg:top-20 -left-16 w-56 h-56 lg:w-72 lg:h-72 bg-white rounded-2xl shadow-xl rotate-12 overflow-hidden group">
        <img
          src="https://picsum.photos/400/400?featured-home"
          alt="Featured Property"
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="relative z-10 w-full max-w-2xl h-full flex flex-col justify-center">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="font-medium">Modern Villa</p>
              <p className="text-sm">Los Angeles, CA</p>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>2.3k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-6 lg:mb-8">
          <div className="flex items-center justify-center gap-2 text-xl lg:text-2xl font-bold text-white">
            <Home className="w-6 h-6 lg:w-8 lg:h-8" />
            <span>HomeBook</span>
          </div>
          <p className="text-sm lg:text-base text-white/80">
            Your Gateway to Dream Properties
          </p>
        </div>

        {/* Property Image Grid */}
        <div className="grid grid-cols-3 gap-1 lg:gap-2 mb-6 lg:mb-8">
          {propertyImages.map((property) => (
            <div 
              key={property.id}
              className="relative aspect-square group cursor-pointer"
            >
              <img
                src={property.url}
                alt={`Property ${property.id}`}
                className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-95"
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-2"
                style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(46,66,191,0.7) 100%)' }}
              >
                <div className="flex items-center text-white text-sm w-full justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>CA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{property.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 gap-2 lg:gap-4 mb-6 lg:mb-8">
          <div className="p-2 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-sm">
            <Users className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1 lg:mb-2 text-white" />
            <p className="text-lg lg:text-xl font-bold text-white">50k+</p>
            <p className="text-xs lg:text-sm text-white/80">Active Agents</p>
          </div>
          <div className="p-2 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-sm">
            <Star className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-1 lg:mb-2 text-white" />
            <p className="text-lg lg:text-xl font-bold text-white">4.9/5</p>
            <p className="text-xs lg:text-sm text-white/80">Satisfaction</p>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="mx-auto w-full max-w-sm bg-white/20 backdrop-blur-sm p-3 lg:p-4 rounded-xl shadow-sm">
          <p className="text-sm italic text-white mb-2">
            "Found our perfect family home through HomeBook's community!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20"></div>
            <div>
              <p className="font-medium text-white">The Johnson Family</p>
              <p className="text-sm text-white/70">Homeowners since 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Buttons Example (Add to your form component)
      <button 
        className="absolute bottom-8 right-8 px-6 py-3 rounded-full text-white font-medium transition-all"
        style={{
          background: 'linear-gradient(135deg, #2e42bf 0%, #9142ca 50%, #d037a2 100%)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Explore Properties
      </button> */}

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-blue-100/50 rounded-full blur-xl"></div>
      <div className="absolute top-0 left-0 w-32 h-32 lg:w-48 lg:h-48 bg-amber-100/50 rounded-full blur-xl"></div>
    </div>
  );
};

export default AuthSidebar;
