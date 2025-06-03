"use client";

import React from "react";
import VideoCard from "@/components/card/VideoCard";

const Home = () => {
  return (
    <div className="max-w-7xl mx-0 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <VideoCard
          videoSrc="/videos/trailer1.mp4"
          posterSrc="/images/trailer1.png"
          title="Trailer 1"
        />
        <VideoCard
          videoSrc="/videos/trailer2.mp4"
          posterSrc="/images/trailer2.png"
          title="Trailer 2"
        />
      </div>
    </div>
  );
};

export default Home;
