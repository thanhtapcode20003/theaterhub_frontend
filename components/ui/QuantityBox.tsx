"use client";

import { FaMinus, FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface QuantityBoxProps {
  onQuantityChange?: (value: number) => void;
  initialValue?: number;
  min?: number;
  max?: number;
}

const QuantityBox = ({
  onQuantityChange,
  initialValue = 0,
  min = 0,
  max = 100,
}: QuantityBoxProps) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleMinus = () => {
    if (inputValue > min) {
      const newValue = inputValue - 1;
      setInputValue(newValue);
      if (onQuantityChange) onQuantityChange(newValue);
    }
  };

  const handlePlus = () => {
    if (inputValue < max) {
      const newValue = inputValue + 1;
      setInputValue(newValue);
      if (onQuantityChange) onQuantityChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleMinus}
        disabled={inputValue <= min}
      >
        <FaMinus className="w-3 h-3" />
      </Button>
      <Input
        className="w-12 text-center bg-gray-800 text-white py-1 rounded border border-gray-600 focus:border-green-400 focus:outline-none"
        type="text"
        value={inputValue}
        readOnly
      />
      <Button
        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePlus}
        disabled={inputValue >= max}
      >
        <FaPlus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default QuantityBox;
