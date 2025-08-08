"use client";

import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  createEventWithFormData,
  formatDescriptionFromText,
  type DescriptionItem,
} from "@/lib/services/eventService";
import { getOrganizers } from "@/lib/services/organizerService";
import { getEventCategories } from "@/lib/services/eventCategory";
import { CreateEventSchema } from "@/lib/validations";
import { Organizer } from "@/types/organizers";
import { EventCategory } from "@/types/categories";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import {
  createLocation,
  type CreateLocationRequest,
} from "@/lib/services/locationService";
import { createShowtime } from "@/lib/services/showtimeService";

const steps = [
  "Tạo sự kiện",
  "Tạo địa điểm",
  "Tạo thời gian",
  "Tạo giá vé",
  "Xác nhận",
];

const EVENT_TYPES = [
  { value: "general", label: "General (không có chỗ ngồi)" },
  { value: "zoned", label: "Zoned (ngồi theo khu vực)" },
  { value: "seated", label: "Seated (chỗ ngồi cố định)" },
];

type EventFormData = z.infer<typeof CreateEventSchema>;

interface FileState {
  poster: File | null;
  description_image: File | null;
}

const EventsPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [createdEventId, setCreatedEventId] = useState<number | null>(36);
  const [createdEventTitle, setCreatedEventTitle] = useState<string | null>(
    "Sự kiện test"
  );
  const [createdLocationId, setCreatedLocationId] = useState<number | null>(15);
  const [locationData, setLocationData] = useState<CreateLocationRequest>({
    name: "",
    location: "",
    description: "",
    map_url: "",
  });
  const [fileState, setFileState] = useState<FileState>({
    poster: null,
    description_image: null,
  });

  // Showtime states
  const [showtimeData, setShowtimeData] = useState({
    location_id: 0,
    start_time: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [createdShowtimeId, setCreatedShowtimeId] = useState<number | null>(
    null
  );

  // Form setup with Zod validation
  const form = useForm<EventFormData>({
    resolver: zodResolver(CreateEventSchema),
    mode: "onBlur", // This will trigger validation when fields lose focus
    reValidateMode: "onChange", // Re-validate on every change after first validation
    defaultValues: {
      title: "",
      event_type: "",
      organizer_id: "",
      category_id: "",
      description: "",
    },
  });

  // Watch form values to trigger re-renders for validation
  const watchedValues = form.watch();

  // Load organizers and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [organizersData, categoriesData] = await Promise.all([
          getOrganizers(),
          getEventCategories(),
        ]);
        setOrganizers(organizersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        showToast({
          type: "error",
          title: "Lỗi tải dữ liệu",
          message: "Không thể tải dữ liệu. Vui lòng thử lại.",
        });
      }
    };
    loadData();
  }, []);

  const handleFileChange = (
    field: "poster" | "description_image",
    files: FileList | null
  ) => {
    if (!files) return;
    setFileState((prev) => ({ ...prev, [field]: files[0] || null }));
  };

  // Handle step 1 - Create event
  const handleCreateEvent = async (data: EventFormData) => {
    setLoading(true);
    try {
      // Format description
      const formattedDescription = formatDescriptionFromText(
        data.description,
        true
      );

      const result = await createEventWithFormData(
        data.title,
        data.event_type,
        parseInt(data.organizer_id),
        parseInt(data.category_id),
        formattedDescription,
        fileState.poster || undefined,
        fileState.description_image ? [fileState.description_image] : undefined
      );

      if (typeof result === "string") {
        throw new Error(result);
      }
      console.log(result);
      // Store the created event ID for later steps
      if (typeof result === "object" && "event" in result) {
        const event = result.event as any;
        setCreatedEventId(event.id);
        setCreatedEventTitle(event.title);
      }

      showToast({
        type: "success",
        title: "Tạo sự kiện thành công!",
        message:
          "Sự kiện đã được tạo thành công. Tiếp tục để thiết lập địa điểm và thời gian.",
      });

      // Move to next step
      setStep(1);
    } catch (error) {
      console.error("Failed to create event:", error);
      showToast({
        type: "error",
        title: "Tạo sự kiện thất bại",
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo sự kiện",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle step 3 - Create showtime
  const handleCreateShowtime = async () => {
    if (
      !createdEventId ||
      !createdLocationId ||
      !selectedDate ||
      !selectedTime
    ) {
      showToast({
        type: "error",
        title: "Lỗi!",
        message: "Vui lòng chọn ngày và giờ cho suất diễn",
      });
      return;
    }

    setLoading(true);
    try {
      // Format datetime for API
      const formattedDate = selectedDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD format
      const startTime = `${formattedDate} ${selectedTime}:00`;

      const result = await createShowtime(createdEventId, {
        location_id: createdLocationId,
        start_time: startTime,
      });

      console.log(result);

      if (typeof result === "string") {
        throw new Error(result);
      }

      setCreatedShowtimeId(result.id);

      showToast({
        type: "success",
        title: "Tạo thời gian thành công!",
        message: `Suất diễn đã được tạo cho ngày ${formattedDate} lúc ${selectedTime}`,
      });

      next();
    } catch (error) {
      console.error("Error creating showtime:", error);
      showToast({
        type: "error",
        title: "Lỗi tạo thời gian!",
        message: error instanceof Error ? error.message : "Đã xảy ra lỗi",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle step 2 - Create location
  const handleCreateLocation = async () => {
    // Validate location data
    if (
      !locationData.name ||
      !locationData.location ||
      !locationData.description ||
      !locationData.map_url
    ) {
      showToast({
        type: "error",
        title: "Thiếu thông tin",
        message: "Vui lòng điền đầy đủ thông tin địa điểm.",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(locationData);

      const result = await createLocation({
        ...locationData,
      });

      if (typeof result === "string") {
        throw new Error(result);
      }
      if (typeof result === "object" && "location" in result) {
        const location = result.location as any;
        setCreatedLocationId(location.location_id);
      }

      showToast({
        type: "success",
        title: "Tạo địa điểm thành công!",
        message:
          "Địa điểm đã được tạo thành công. Tiếp tục để thiết lập thời gian.",
      });

      // Move to next step
      setStep(2);
    } catch (error) {
      console.error("Failed to create location:", error);
      showToast({
        type: "error",
        title: "Tạo địa điểm thất bại",
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo địa điểm",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle final submission (step 5)
  const onSubmit = async () => {
    if (!createdEventId) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Không tìm thấy thông tin sự kiện.",
      });
      return;
    }

    showToast({
      type: "success",
      title: "Hoàn tất!",
      message: `Sự kiện với ID ${createdEventId} đã được thiết lập hoàn tất.`,
    });

    // Reset everything for new event creation
    form.reset();
    setFileState({
      poster: null,
      description_image: null,
    });
    setLocationData({
      name: "",
      location: "",
      description: "",
      map_url: "",
    });
    setCreatedEventId(null);
    setStep(0);
  };

  // Check if step 1 is valid (all required fields filled)
  const isStep1Valid = useMemo(() => {
    const isValid =
      watchedValues.title?.trim() !== "" &&
      watchedValues.event_type !== "" &&
      watchedValues.organizer_id !== "" &&
      watchedValues.category_id !== "" &&
      watchedValues.description?.trim() !== "" &&
      fileState.poster !== null;
    // description_image is optional

    return isValid;
  }, [
    watchedValues.title,
    watchedValues.event_type,
    watchedValues.organizer_id,
    watchedValues.category_id,
    watchedValues.description,
    fileState.poster,
  ]);

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));
  console.log(createdEventId);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Step Indicator */}
        <div className="flex justify-between items-center bg-zinc-900 rounded-lg px-4 py-3 ">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 text-center relative">
              <div
                className={cn(
                  "text-sm font-medium transition-colors",
                  i === step
                    ? "text-red-500"
                    : i < step
                      ? "text-red-300"
                      : "text-zinc-500"
                )}
              >
                {i + 1}. {label}
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 w-px h-4 bg-red-900/30" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="min-h- shadow-lg bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-100">
              {steps[step]}
              {createdEventId && step > 0 && (
                <span className="text-sm text-zinc-400 ml-2">
                  (Event: {createdEventTitle})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-zinc-900">
            {step === 0 && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateEvent)}
                  className="space-y-6"
                  noValidate
                >
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2.5">
                        <FormLabel className="paragraph-medium text-red-100">
                          Tên sự kiện *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập tên sự kiện..."
                            className="paragraph-regular bg-zinc-800  text-red-50 placeholder:text-zinc-400 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Event Type */}
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2.5">
                        <FormLabel className="paragraph-medium text-red-100">
                          Loại sự kiện *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="paragraph-regular bg-zinc-800  text-red-50 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20">
                              <SelectValue
                                placeholder="Chọn loại sự kiện"
                                className="text-zinc-400"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 ">
                            {EVENT_TYPES.map((type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                                className="text-red-50 hover:bg-red-900/30 focus:bg-red-900/30"
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Organizer */}
                  <FormField
                    control={form.control}
                    name="organizer_id"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2.5">
                        <FormLabel className="paragraph-medium text-red-100">
                          Nhà tổ chức *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="paragraph-regular bg-zinc-800  text-red-50 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20">
                              <SelectValue
                                placeholder="Chọn nhà tổ chức"
                                className="text-zinc-400"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 ">
                            {organizers.map((organizer) => (
                              <SelectItem
                                key={organizer.organizer_id}
                                value={organizer.organizer_id.toString()}
                                className="text-red-50 hover:bg-red-900/30 focus:bg-red-900/30"
                              >
                                {organizer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2.5">
                        <FormLabel className="paragraph-medium text-red-100">
                          Danh mục *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="paragraph-regular bg-zinc-800  text-red-50 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20">
                              <SelectValue
                                placeholder="Chọn danh mục"
                                className="text-zinc-400"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 ">
                            {categories.map((category) => (
                              <SelectItem
                                key={category.category_id}
                                value={category.category_id.toString()}
                                className="text-red-50 hover:bg-red-900/30 focus:bg-red-900/30"
                              >
                                {category.category_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col gap-2.5">
                        <FormLabel className="paragraph-medium text-red-100">
                          Mô tả sự kiện *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Nhập mô tả sự kiện... (Mỗi dòng mới sẽ tạo một đoạn văn riêng. Hình ảnh sẽ
                          được thêm tự động.)"
                            rows={6}
                            className="paragraph-regular bg-zinc-800  text-red-50 placeholder:text-zinc-400 no-focus rounded-1.5 border resize-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Poster Upload */}
                  <div className="space-y-2">
                    <label className="paragraph-medium text-red-100">
                      Ảnh poster (1280x720) *
                    </label>
                    <div className="border-2 border-dashed  rounded-lg p-6 bg-zinc-800">
                      <div className="text-center">
                        {fileState.poster ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <Upload className="h-5 w-5 text-red-400" />
                              <span className="text-sm font-medium text-red-400">
                                {fileState.poster.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setFileState((prev) => ({
                                    ...prev,
                                    poster: null,
                                  }))
                                }
                                className="text-zinc-400 hover:text-red-100 hover:bg-red-900/30"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-zinc-500" />
                            <div>
                              <Button
                                type="button"
                                variant="outline"
                                asChild
                                className=" text-red-200 hover:bg-red-900/30 hover:text-red-100"
                              >
                                <label
                                  htmlFor="poster-upload"
                                  className="cursor-pointer"
                                >
                                  Thêm ảnh poster
                                </label>
                              </Button>
                              <input
                                id="poster-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange("poster", e.target.files)
                                }
                              />
                            </div>
                            <p className="text-sm text-zinc-400">
                              Kích thước khuyến nghị: 1280x720px
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description Image */}
                  <div className="space-y-2">
                    <label className="paragraph-medium text-red-100">
                      Ảnh mô tả
                    </label>
                    <div className="border-2 border-dashed  rounded-lg p-6 bg-zinc-800">
                      <div className="text-center">
                        {fileState.description_image ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <Upload className="h-5 w-5 text-red-400" />
                              <span className="text-sm font-medium text-red-400">
                                {fileState.description_image.name}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setFileState((prev) => ({
                                    ...prev,
                                    description_image: null,
                                  }))
                                }
                                className="text-zinc-400 hover:text-red-100 hover:bg-red-900/30"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-zinc-500" />
                            <div>
                              <Button
                                type="button"
                                variant="outline"
                                asChild
                                className=" text-red-200 hover:bg-red-900/30 hover:text-red-100"
                              >
                                <label
                                  htmlFor="description-image-upload"
                                  className="cursor-pointer"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Thêm ảnh mô tả
                                </label>
                              </Button>
                              <input
                                id="description-image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileChange(
                                    "description_image",
                                    e.target.files
                                  )
                                }
                              />
                            </div>
                            <p className="text-sm text-zinc-400">
                              Chọn ảnh để bổ sung cho mô tả sự kiện
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Location Name */}
                  <div className="flex w-full flex-col gap-2.5">
                    <label className="paragraph-medium text-red-100">
                      Tên địa điểm *
                    </label>
                    <Input
                      value={locationData.name}
                      onChange={(e) =>
                        setLocationData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Tên địa điểm"
                      className="paragraph-regular bg-zinc-800 text-red-50 placeholder:text-zinc-400 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Location Address */}
                  <div className="flex w-full flex-col gap-2.5">
                    <label className="paragraph-medium text-red-100">
                      Địa chỉ *
                    </label>
                    <Input
                      value={locationData.location}
                      onChange={(e) =>
                        setLocationData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Địa chỉ đầy đủ"
                      className="paragraph-regular bg-zinc-800 text-red-50 placeholder:text-zinc-400 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex w-full flex-col gap-2.5">
                    <label className="paragraph-medium text-red-100">
                      Mô tả *
                    </label>
                    <Textarea
                      value={locationData.description}
                      onChange={(e) =>
                        setLocationData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Mô tả về địa điểm"
                      rows={3}
                      className="paragraph-regular bg-zinc-800 text-red-50 placeholder:text-zinc-400 no-focus rounded-1.5 border resize-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Map URL */}
                  <div className="flex w-full flex-col gap-2.5">
                    <label className="paragraph-medium text-red-100">
                      Liên kết Google Maps
                    </label>
                    <Input
                      value={locationData.map_url}
                      onChange={(e) =>
                        setLocationData((prev) => ({
                          ...prev,
                          map_url: e.target.value,
                        }))
                      }
                      placeholder="https://maps.app.goo.gl/..."
                      className="paragraph-regular bg-zinc-800 text-red-50 placeholder:text-zinc-400 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-red-100 mb-4">
                    Chọn thời gian diễn ra sự kiện
                  </h3>

                  {/* Event and Location Info */}
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Sự kiện:</span>
                        <span className="text-red-100 font-medium">
                          {createdEventTitle}
                        </span>
                        <span className="text-zinc-500">
                          (ID: {createdEventId})
                        </span>
                      </div>
                      {createdLocationId && (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">Địa điểm:</span>
                          <span className="text-green-400">
                            ✓ ID: {createdLocationId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div className="flex w-full flex-col gap-2.5">
                    <label className="paragraph-medium text-red-100">
                      Chọn ngày và giờ *
                    </label>
                    <Input
                      type="datetime-local"
                      value={
                        selectedDate && selectedTime
                          ? `${selectedDate.toLocaleDateString("sv-SE")}T${selectedTime}`
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value) {
                          const [date, time] = e.target.value.split("T");
                          setSelectedDate(new Date(date));
                          setSelectedTime(time);
                        } else {
                          setSelectedDate(undefined);
                          setSelectedTime("");
                        }
                      }}
                      min={`${new Date().toLocaleDateString("sv-SE")}T00:00`}
                      className="paragraph-regular bg-zinc-800 text-red-50 placeholder:text-zinc-400 no-focus min-h-12 rounded-1.5 border focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Preview formatted datetime */}
                  {selectedDate && selectedTime && (
                    <div className="flex w-full flex-col gap-2.5">
                      <label className="paragraph-medium text-red-100">
                        Thời gian đã chọn
                      </label>
                      <div className="p-3 bg-zinc-700 rounded-lg border border-zinc-600">
                        <p className="text-green-400 font-mono">
                          {selectedDate.toLocaleDateString("sv-SE")}{" "}
                          {selectedTime}:00
                        </p>
                        <p className="text-zinc-400 text-sm mt-1">
                          {selectedDate.toLocaleDateString("vi-VN")} lúc{" "}
                          {selectedTime}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Showtime ID Display */}
                  {createdShowtimeId && (
                    <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg">
                      <p className="text-green-400 font-medium">
                        ✅ Đã tạo suất diễn thành công!
                      </p>
                      <p className="text-zinc-300 text-sm">
                        Showtime ID: {createdShowtimeId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-zinc-300 mb-4">
                  Cấu hình giá vé cho sự kiện ID: {createdEventId}
                </div>
                <Input placeholder="Loại vé 1" />
                <Input placeholder="Giá vé 1" />
                <Input placeholder="Số lượng vé" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={back}
              disabled={step === 0}
              className=" text-red-200 hover:bg-red-900/30 hover:text-red-100 bg-zinc-900"
            >
              Quay lại
            </Button>
            <Button
              variant="outline"
              onClick={next}
              className=" text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 bg-zinc-900"
            >
              Bỏ qua
            </Button>
          </div>
          {step < steps.length - 1 ? (
            <Button
              onClick={
                step === 0
                  ? form.handleSubmit(handleCreateEvent)
                  : step === 1
                    ? handleCreateLocation
                    : step === 2
                      ? handleCreateShowtime
                      : next
              }
              disabled={
                step === 0
                  ? !isStep1Valid || loading
                  : step === 1
                    ? !locationData.name ||
                      !locationData.location ||
                      !locationData.description ||
                      loading
                    : step === 2
                      ? !selectedDate || !selectedTime || loading
                      : false
              }
              className="primary-gradient paragraph-medium min-h-12 px-6 font-inter text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && step === 0 ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : loading && step === 1 ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Đang tạo địa điểm...
                </>
              ) : loading && step === 2 ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Đang tạo thời gian...
                </>
              ) : step === 0 ? (
                "Tạo sự kiện"
              ) : step === 1 ? (
                "Tạo địa điểm"
              ) : step === 2 ? (
                "Tạo thời gian"
              ) : step === 3 ? (
                "Tạo giá vé"
              ) : (
                "Tiếp tục"
              )}
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={loading}
              className="primary-gradient paragraph-medium min-h-12 px-6 font-inter text-white active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
