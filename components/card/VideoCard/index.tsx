"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FiVolume2 } from "react-icons/fi";
import { BiVolumeMute } from "react-icons/bi";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  videoSrc: string;
  posterSrc: string;
  title: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoSrc,
  posterSrc,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      // Don't reset currentTime to keep the position
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-84 object-cover"
        style={{ display: isPlaying ? "block" : "none" }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Poster Image - shown when video is not playing */}
      {!isPlaying && (
        <Image
          src={posterSrc}
          alt={title}
          width={1200}
          height={256}
          className="w-full h-84 object-cover"
        />
      )}

      {/* Xem chi tiết Button (Bottom Left) */}
      <Button className="absolute bottom-2 left-2 bg-white text-gray-800 text-sm font-medium py-1 px-3  hover:bg-gray-200 transition cursor-pointer">
        Xem chi tiết
      </Button>

      {/* Volume Toggle Icon (Bottom Right) */}
      <button
        onClick={toggleMute}
        className="absolute bottom-2 right-2 text-white hover:text-gray-300 transition cursor-pointer"
      >
        {isMuted ? (
          <BiVolumeMute className="w-5 h-5" />
        ) : (
          <FiVolume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default VideoCard;
