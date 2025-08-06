"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  "Thông tin sự kiện",
  "Thời gian & Loại vé",
  "Cài đặt",
  "Thông tin thanh toán",
];

const EventsPage = () => {
  const [step, setStep] = useState(0);

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Step Indicator */}
      <div className="flex justify-between items-center bg-muted rounded-lg px-4 py-2">
        {steps.map((label, i) => (
          <div key={i} className="flex-1 text-center relative">
            <div
              className={cn(
                "text-sm font-medium",
                i === step ? "text-primary" : "text-muted-foreground"
              )}
            >
              {i + 1}. {label}
            </div>
            {i < steps.length - 1 && (
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 w-px h-4 bg-border" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <Input placeholder="Tên sự kiện" />
              <Input placeholder="Mô tả ngắn" />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Input placeholder="Ngày diễn ra" />
              <Input placeholder="Loại vé" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <Input placeholder="Cài đặt riêng tư" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <Input placeholder="Phương thức thanh toán" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          Quay lại
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={next}>Tiếp tục</Button>
        ) : (
          <Button className="bg-green-600 hover:bg-green-700">Hoàn tất</Button>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
