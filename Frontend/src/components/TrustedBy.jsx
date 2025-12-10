// components/TrustedBy.jsx
import React from 'react';

const TrustedBySection = () => {
  // Temporary placeholder logos (replace with real SVGs later)
  const logos = [
    { name: 'RE/MAX', path: '/path/to/remax-logo.svg' },
    { name: 'Coldwell Banker', path: '/path/to/coldwell-logo.svg' },
    { name: 'Century 21', path: '/path/to/century21-logo.svg' },
    { name: 'Sothebys', path: '/path/to/sothebys-logo.svg' }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-sm text-center text-white/80 mb-4">
        Trusted by industry leaders
      </h3>
      <div className="flex flex-wrap justify-center gap-6">
        {logos.map((logo, index) => (
          <div 
            key={index}
            className="h-8 w-24 bg-white/10 rounded-lg flex items-center justify-center"
          >
            {/* Temporary text until logos are added */}
            <span className="text-xs font-medium text-white/80">
              {logo.name}
            </span>
            
            {/* For real logos, use:
            <img 
              src={logo.path} 
              alt={logo.name} 
              className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
            /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export  {TrustedBySection};