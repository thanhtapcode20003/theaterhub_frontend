"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface ExpandableDescriptionProps {
  content: string;
  images?: string[];
  maxHeight?: string; // ví dụ: "200px"
}

export default function ExpandableDescription({
  content,
  images = [],
  maxHeight = "150px",
}: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Giới thiệu</h2>
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          expanded ? "" : "max-h-[150px]"
        }`}
        style={{ maxHeight: expanded ? "none" : maxHeight }}
      >
        <div className="whitespace-pre-line text-gray-300">{content}</div>

        {/* Image Content */}
        {images.map((imageUrl, index) => (
          <div key={index} className="my-4">
            <Image
              src={imageUrl}
              alt={`Description image ${index + 1}`}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
      {!expanded && (
        <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none rounded-lg" />
      )}

      <div className="flex justify-center mt-2">
        <Button
          variant="ghost"
          className="text-md flex items-center gap-1 text-red-500 hover:text-red-400 hover:bg-transparent z-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Thu gọn <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Xem thêm <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
