"use client";

import { useState, useEffect } from "react";
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

const steps = [
  "Thông tin sự kiện",
  "Thời gian & Loại vé",
  "Cài đặt",
  "Thông tin thanh toán",
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
  const [fileState, setFileState] = useState<FileState>({
    poster: null,
    description_image: null,
  });

  // Form setup with Zod validation
  const form = useForm<EventFormData>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: "",
      event_type: "",
      organizer_id: "",
      category_id: "",
      description: "",
    },
  });

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

  const onSubmit = async (data: EventFormData) => {
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

      showToast({
        type: "success",
        title: "Tạo sự kiện thành công!",
        message: "Sự kiện đã được tạo và đang chờ phê duyệt.",
      });

      // Reset form and files
      form.reset();
      setFileState({
        poster: null,
        description_image: null,
      });
      setStep(0);
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

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

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
                    ? "text-red-400"
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
        <Card className="min-h-[600px]   shadow-lg bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-100">
              {steps[step]}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-zinc-900">
            {step === 0 && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                            placeholder="Nhập mô tả sự kiện... (mỗi dòng mới sẽ tạo một đoạn văn riêng)"
                            rows={6}
                            className="paragraph-regular bg-zinc-800  text-red-50 placeholder:text-zinc-400 no-focus rounded-1.5 border resize-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                          />
                        </FormControl>
                        <p className="text-sm text-zinc-400">
                          Mỗi dòng mới sẽ tạo một đoạn văn riêng. Hình ảnh sẽ
                          được thêm tự động.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Poster Upload */}
                  <div className="space-y-2">
                    <label className="paragraph-medium text-red-100">
                      Ảnh poster (1280x720)
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
          <Button
            variant="outline"
            onClick={back}
            disabled={step === 0}
            className=" text-red-200 hover:bg-red-900/30 hover:text-red-100 bg-zinc-900"
          >
            Quay lại
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={next}
              disabled={step === 0 && !form.formState.isValid}
              className="bg-red-600 hover:bg-red-700 paragraph-medium min-h-12 px-6 font-inter text-white cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
            >
              Tiếp tục
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || !form.formState.isValid}
              className="bg-red-600 hover:bg-red-700 paragraph-medium min-h-12 px-6 font-inter text-white cursor-pointer transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                "Hoàn tất"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
