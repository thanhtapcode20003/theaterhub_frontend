"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Seat } from "@/lib/services/ticketTypeService";

interface SeatPickerProps {
  seats: Seat[];
  onSeatSelect: (selectedSeats: Seat[]) => void;
  maxSeats?: number;
}

interface SeatGroupProps {
  row: string;
  seats: Seat[];
  selectedSeats: Set<number>;
  onSeatClick: (seat: Seat) => void;
}

const SeatGroup: React.FC<SeatGroupProps> = ({
  row,
  seats,
  selectedSeats,
  onSeatClick,
}) => {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="w-8 text-white font-bold text-center mr-4">{row}</div>
      <div className="flex gap-2">
        {seats.map((seat) => (
          <button
            key={seat.seat_id}
            onClick={() => onSeatClick(seat)}
            disabled={seat.status === "booked" || seat.status === "disabled"}
            className={`
              w-10 h-10 rounded text-xs font-bold border-2 transition-all duration-200
              ${getSeatStyles(seat, selectedSeats.has(seat.seat_id))}
            `}
            title={`${seat.seat_type_name} - ${seat.price}đ`}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>
      <div className="w-8 ml-4"></div> {/* Spacer for balance */}
    </div>
  );
};

const getSeatStyles = (seat: Seat, isSelected: boolean): string => {
  if (seat.status === "booked") {
    return "bg-gray-500 border-gray-500 text-gray-300 cursor-not-allowed";
  }

  if (seat.status === "disabled") {
    return "bg-gray-700 border-gray-700 text-gray-500 cursor-not-allowed";
  }

  if (isSelected) {
    return "bg-red-500 border-red-500 text-white scale-110";
  }

  // Different colors for different seat types
  switch (seat.seat_type_code) {
    case "vip":
      return "bg-yellow-600 border-yellow-500 text-white hover:bg-yellow-500 hover:scale-105";
    case "double":
      return "bg-pink-600 border-pink-500 text-white hover:bg-pink-500 hover:scale-105";
    case "standard":
      return "bg-blue-600 border-blue-500 text-white hover:bg-blue-500 hover:scale-105";
    default:
      return "bg-gray-600 border-gray-500 text-white hover:bg-gray-500 hover:scale-105";
  }
};

const SeatPicker: React.FC<SeatPickerProps> = ({
  seats,
  onSeatSelect,
  maxSeats = 10,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<number>>(new Set());

  // Group seats by row
  const groupedSeats = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.seat_row]) {
        acc[seat.seat_row] = [];
      }
      acc[seat.seat_row].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>
  );

  // Sort rows alphabetically and seats by number within each row
  const sortedRows = Object.keys(groupedSeats).sort();
  sortedRows.forEach((row) => {
    groupedSeats[row].sort((a, b) => a.seat_number - b.seat_number);
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked" || seat.status === "disabled") return;

    const newSelectedSeats = new Set(selectedSeats);

    if (selectedSeats.has(seat.seat_id)) {
      newSelectedSeats.delete(seat.seat_id);
    } else if (selectedSeats.size < maxSeats) {
      newSelectedSeats.add(seat.seat_id);
    }

    setSelectedSeats(newSelectedSeats);
  };

  // Update parent component when selection changes
  const notifyParent = useCallback(() => {
    const selected = seats.filter((seat) => selectedSeats.has(seat.seat_id));
    onSeatSelect(selected);
  }, [selectedSeats, seats, onSeatSelect]);

  useEffect(() => {
    notifyParent();
  }, [notifyParent]);

  // Get seat type summary
  const seatTypes = Array.from(
    new Set(seats.map((seat) => seat.seat_type_code))
  );

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      {/* Screen indicator */}
      <div className="mb-8 text-center">
        <div className="bg-gray-300 h-2 rounded-full mx-auto w-80 mb-2"></div>
        <p className="text-gray-400 text-sm">Màn hình</p>
      </div>

      {/* Seat map */}
      <div className="mb-6 flex flex-col items-center">
        <div className="inline-block">
          {sortedRows.map((row) => (
            <SeatGroup
              key={row}
              row={row}
              seats={groupedSeats[row]}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-600 pt-4">
        <h4 className="text-white font-semibold mb-3">Chú thích:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {seatTypes.map((type) => {
            const sampleSeat = seats.find(
              (seat) => seat.seat_type_code === type
            );
            if (!sampleSeat) return null;

            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded border-2 ${getSeatStyles(sampleSeat, false)}`}
                ></div>
                <span>{sampleSeat.seat_type_name}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 bg-red-500 border-red-500"></div>
            <span>Đã chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 bg-gray-500 border-gray-500"></div>
            <span>Đã đặt</span>
          </div>
        </div>
      </div>

      {/* Selection info */}
      <div className="mt-4 text-center">
        <p className="text-gray-400">
          Đã chọn: {selectedSeats.size}/{maxSeats} ghế
        </p>
      </div>
    </div>
  );
};

export default SeatPicker;
