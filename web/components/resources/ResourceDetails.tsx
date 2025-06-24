"use client";
import { useState } from "react";
import { Resource } from "@/types/resource";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  FileText,
  Download,
  Share2,
  Building,
  Hash,
  Book,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  checkInstitutionActiveSubscription,
  checkUserActiveSubscription,
  downloadResource,
} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface ResourceDetailsProps {
  resource: Resource;
  dictionary: AppDictionary;
  lang: string;
}

export function ResourceDetails({
  resource,
  dictionary,
  lang,
}: ResourceDetailsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.abstract,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = async () => {
    if (resource.paid === "free") {
      if (isAuthenticated) {
        // Log download for authenticated users
        await doDownload();
      } else if (resource.download_url) {
        // Unauthenticated: just trigger download using public URL
        const link = document.createElement("a");
        link.href = resource.download_url;
        link.target = "_blank";
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadStatus("success");
        setTimeout(() => setDownloadStatus("idle"), 2000);
      } else {
        toast({
          title: "Download Unavailable",
          description: "No download link available for this resource.",
          variant: "destructive",
        });
      }
      return;
    }

    // Premium resource logic (as before)
    if (!isAuthenticated) {
      router.push(
        `/${lang}/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    if (user?.role === "user") {
      // Check if user has active subscription
      const hasActive = await checkUserActiveSubscription(user.id);
      if (!hasActive) {
        router.push(`/${lang}/pricing?resource=${resource.id}`);
        return;
      }
      // Allow download and log
      await doDownload();
    } else if (user?.role === "student" && user.institution_id) {
      // Check if institution has active subscription
      const hasActive = await checkInstitutionActiveSubscription(
        user.institution_id
      );
      if (!hasActive) {
        toast({
          title: "Institution Subscription Required",
          description:
            "Your institution must have an active subscription to access this resource.",
          variant: "destructive",
        });
        return;
      }
      // Allow download and log
      await doDownload();
    } else {
      toast({
        title: "Access Denied",
        description: "You do not have permission to download this resource.",
        variant: "destructive",
      });
    }
  };

  // Helper to perform the download and log
  const doDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus("idle");
    try {
      const result = await downloadResource(resource.id.toString());
      const link = document.createElement("a");
      link.href = result.download_url;
      link.target = "_blank";
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStatus("success");
      toast({
        title: "Download Successful",
        description: "Your resource is being downloaded.",
      });
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch (error: unknown) {
      setDownloadStatus("error");
      let message = "Failed to download resource.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Download Failed",
        description: message,
        variant: "destructive",
      });
      setTimeout(() => setDownloadStatus("idle"), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDownloadButtonContent = () => {
    if (downloadStatus === "success") {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Downloaded!
        </>
      );
    }

    if (downloadStatus === "error") {
      return (
        <>
          <AlertCircle className="h-4 w-4 mr-2" />
          Download Failed
        </>
      );
    }

    if (resource.paid === "premium") {
      return (
        <>
          <Crown className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download Premium"}
        </>
      );
    }

    return (
      <>
        <Download className="h-4 w-4 mr-2" />
        {isDownloading
          ? "Downloading..."
          : dictionary.resources.details.download}
      </>
    );
  };

  const getDownloadButtonVariant = () => {
    if (downloadStatus === "success") return "default";
    if (downloadStatus === "error") return "destructive";
    if (resource.paid === "premium") return "default";
    return "default";
  };

  return (
    <article className="space-y-8">
      {/* Back Button */}
      <div className="pt-4">
        <Link href={`/${lang}/resources`}>
          <Button
            variant="ghost"
            className="gap-2 hover:bg-accent/50 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            {dictionary.resources.backToList}
          </Button>
        </Link>
      </div>

      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient leading-tight">
            {resource.title}
          </h1>
          <Badge
            variant={resource.paid === "premium" ? "default" : "secondary"}
            className="uppercase text-sm tracking-wider px-3 py-1"
          >
            {resource.paid === "premium" ? (
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                {dictionary.resources.premium}
              </div>
            ) : (
              dictionary.resources.free
            )}
          </Badge>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl">
          {resource.authors.length > 0 && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">{resource.authors.join(", ")}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {new Date(resource.publication_date).toLocaleDateString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium">{resource.type}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Book className="h-4 w-4 text-primary" />
            <span className="font-medium">{resource.language}</span>
          </div>
          {resource.category_name && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Building className="h-4 w-4 text-primary" />
              <span className="font-medium">{resource.category_name}</span>
            </div>
          )}
          {resource.doi && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Hash className="h-4 w-4 text-primary" />
              <span className="font-medium">{resource.doi}</span>
            </div>
          )}
          {resource.downloads && resource.downloads > 0 && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Download className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {resource.downloads} {dictionary.resources.details.download}
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          className={`flex-1 sm:flex-none bg-gradient-primary hover:bg-gradient-primary-hover shadow-lg hover:shadow-xl transition-all duration-300 ${
            downloadStatus === "success"
              ? "bg-green-600 hover:bg-green-700"
              : ""
          } ${downloadStatus === "error" ? "bg-red-600 hover:bg-red-700" : ""}`}
          onClick={handleDownload}
          disabled={isDownloading}
          variant={getDownloadButtonVariant()}
        >
          {getDownloadButtonContent()}
        </Button>

        <Button
          variant="outline"
          className="flex-1 sm:flex-none border-border/50 hover:border-border hover:bg-accent/20 transition-all duration-300"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          {dictionary.resources.details.share}
        </Button>
      </div>

      {/* Premium Resource Notice */}
      {resource.paid === "premium" && !isAuthenticated && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800">
            <Lock className="h-4 w-4" />
            <span className="font-medium">Premium Resource</span>
          </div>
          <p className="text-amber-700 text-sm mt-1">
            This is a premium resource. Please log in to access it.
          </p>
        </div>
      )}

      {/* Abstract Section */}
      <div className="space-y-4 p-6 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl">
        <h2 className="text-xl font-semibold text-foreground">
          {dictionary.resources.details.abstract}
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base">
          {resource.abstract}
        </p>
      </div>

      {/* Bottom Back Button */}
      <div className="pt-4">
        <Link href={`/${lang}/resources`}>
          <Button
            variant="ghost"
            className="gap-2 hover:bg-accent/50 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            {dictionary.resources.backToList}
          </Button>
        </Link>
      </div>
    </article>
  );
}
