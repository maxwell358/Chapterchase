"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ImageIcon } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_PDF_TYPES,
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_VOICE,
} from "@/lib/constants";
import FileUploader from "./FileUploader";
import VoiceSelector from "./VoiceSelector";
import LoadingOverlay from "./LoadingOverlay";
import { useAuth } from "@clerk/nextjs";
import { toast } from "@/components/ui/sonner";
import {
  checkBookExists,
  createBook,
  saveBookSegments,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { parsePDFFile } from "@/lib/utils";

const UploadForm = () => {
  const uploadToApi = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload failed (${res.status}) ${text}`);
    }

    return (await res.json()) as { url: string; pathname: string };
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "We are setting up the interview experience.",
  );
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: DEFAULT_VOICE,
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (data: BookUploadFormValues) => {
    if (!userId) {
      return toast.error("Please login to upload books");
    }

    setIsSubmitting(true);
    setLoadingMessage("Checking your library...");

    // PostHog -> Track Book Uploads...

    try {
      const existsCheck = await checkBookExists(data.title);

      if (existsCheck.exists && existsCheck.book) {
        toast.info("Book with same title already exists.");
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const fileTitle =
        data.title.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now();
      const pdfFile = data.pdfFile;
      if (!pdfFile) {
        toast.error("Please select a PDF file");
        setIsSubmitting(false);
        return;
      }

      const pdfUploadPromise = uploadToApi(pdfFile, `${fileTitle}.pdf`);

      setLoadingMessage("Parsing PDF...");
      const parsedPDF = await parsePDFFile(pdfFile, {
        onProgress: ({ page, total }) => {
          setLoadingMessage(`Parsing PDF (${page}/${total})`);
        },
      });

      if (parsedPDF.content.length === 0) {
        toast.error(
          "Failed to parse PDF. Please try again with a different file.",
        );
        setIsSubmitting(false);
        return;
      }

      setLoadingMessage("Uploading PDF...");
      const uploadedPdfBlob = await pdfUploadPromise;

      let coverUrl: string;

      if (data.coverImage) {
        setLoadingMessage("Uploading cover image...");
        const coverFile = data.coverImage;
        const uploadedCoverBlob = await uploadToApi(coverFile, `${fileTitle}_cover.png`);
        coverUrl = uploadedCoverBlob.url;
      } else if (parsedPDF.coverBlob) {
        setLoadingMessage("Uploading cover image...");
        const uploadedCoverBlob = await uploadToApi(
          parsedPDF.coverBlob as unknown as File,
          `${fileTitle}_cover.png`,
        );
        coverUrl = uploadedCoverBlob.url;
      } else {
        coverUrl = "/assets/book-placeholder.png";
      }

      setLoadingMessage("Creating your book...");
      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      });

      if (!book.success) {
        toast.error((book.error as string) || "Failed to create book");
        if (book.isBillingError) {
          router.push("/subscriptions");
        }
        setIsSubmitting(false);

        return;
      }

      if (book.alreadyExists) {
        toast.info("Book with same title already exists.");
        form.reset();
        router.push(`/books/${book.data.slug}`);
        return;
      }

      setLoadingMessage("Saving book segments...");
      const segments = await saveBookSegments(
        book.data._id,
        userId,
        parsedPDF.content,
      );

      if (!segments.success) {
        toast.error("Failed to save book segments");
        throw new Error("Failed to save book segments");
      }

      form.reset();
      router.push("/");
    } catch (error) {
      console.error(error);

      toast.error("Failed to upload book. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <LoadingOverlay isOpen={isSubmitting} message={loadingMessage} />

      <div className="new-book-wrapper">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. PDF File Upload */}
            <FileUploader
              control={form.control}
              name="pdfFile"
              label="Book PDF File"
              acceptTypes={ACCEPTED_PDF_TYPES}
              icon={Upload}
              placeholder="Click to upload PDF"
              hint="PDF file (max 50MB)"
              disabled={isSubmitting}
            />

            {/* 2. Cover Image Upload */}
            <FileUploader
              control={form.control}
              name="coverImage"
              label="Cover Image (Optional)"
              acceptTypes={ACCEPTED_IMAGE_TYPES}
              icon={ImageIcon}
              placeholder="Click to upload cover image"
              hint="Leave empty to auto-generate from PDF"
              disabled={isSubmitting}
            />

            {/* 3. Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input"
                      placeholder="ex: Rich Dad Poor Dad"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 4. Author Input */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Author Name</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input"
                      placeholder="ex: Robert Kiyosaki"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 5. Voice Selector */}
            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">
                    Choose Assistant Voice
                  </FormLabel>
                  <FormControl>
                    <VoiceSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 6. Submit Button */}
            <Button type="submit" className="form-btn" disabled={isSubmitting}>
              Begin Synthesis
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default UploadForm;
