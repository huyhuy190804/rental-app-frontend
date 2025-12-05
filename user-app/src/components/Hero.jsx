//wstudios-frontend/user-app/src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { carouselSlides } from "../utils/mockData"; // Adjust path theo cấu trúc folder của bạn

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Chuyển slide mỗi 5 giây

    // Cleanup khi component unmount
    return () => clearInterval(timer);
  }, [currentSlide]); // Re-run effect khi currentSlide thay đổi

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-900">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselSlides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <img 
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Text and Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white w-full px-4">
        <h2 className="text-white mb-2">{carouselSlides[currentSlide].title}</h2>
        <p className="text-lg mb-6">{carouselSlides[currentSlide].location}</p>
        
        {/* Dots Indicator */}
        <div className="flex gap-2 justify-center">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;