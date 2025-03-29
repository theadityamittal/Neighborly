import React from "react";

const EventCardSmall = ({ title, provider, location, date, image, tags, description }) => {
  return (
    <div className="flex w-full max-w-[615px] h-[316px] border border-[#E6E6E6] shadow-sm rounded-lg overflow-hidden bg-white">
      {/* Image side */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Info side */}
      <div className="w-1/2 p-6 relative flex flex-col justify-between">
        {/* Tags */}
        <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
          {tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#F9F9F9] text-xs font-bold text-[#585966] px-3 py-1 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Main content */}
        <div className="mt-16">
          <h3 className="font-extrabold text-lg text-black">{title}</h3>
          <p className="text-sm font-semibold text-[#2E3A44] mt-1">{date}</p>
          <p className="text-sm text-[#585966] mt-2 line-clamp-3">{description}</p>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-[#585966]">{location}</span>
          <button className="bg-[#EA942C] text-white text-xs px-4 py-2 rounded shadow-sm border border-black">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCardSmall;
