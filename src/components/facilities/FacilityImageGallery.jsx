import { useState } from 'react';

function FacilityImageGallery({ images = [], facilityName = 'Facility' }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fallback for no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-950 dark:to-primary-900 rounded-2xl flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🏢</div>
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          Image Gallery Coming Soon
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400">
          Professional photos will be displayed here
        </p>
      </div>
    );
  }

  const openModal = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* main */}
      <div className="space-y-4">
        {/* img */}
        <div 
          className="relative w-full h-96 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openModal(selectedImage)}
        >
          <img
            src={images[selectedImage]}
            alt={`${facilityName} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* overlay for hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
          {/* img counter */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {selectedImage + 1} / {images.length}
          </div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-24 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImage === index
                  ? 'ring-4 ring-primary-500 scale-95'
                  : 'ring-2 ring-neutral-200 dark:ring-neutral-700 hover:ring-primary-300 dark:hover:ring-primary-700'
              }`}
            >
              <img
                src={image}
                alt={`${facilityName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* selected overlay */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-primary-500/20"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* fullscreen modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
          {/* close */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* img counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {selectedImage + 1} / {images.length}
          </div>

          {/* prev */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* next */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* main img */}
          <div className="w-full h-full flex items-center justify-center p-12">
            <img
              src={images[selectedImage]}
              alt={`${facilityName} - Image ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* thumbnail */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 bg-white/5 backdrop-blur-sm rounded-xl scrollbar-minimal">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${
                  selectedImage === index
                    ? 'ring-4 ring-white scale-110'
                    : 'ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default FacilityImageGallery;