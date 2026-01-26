import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Upload, X, RotateCcw } from "lucide-react";
import { saveVideo, deleteVideo } from "@/lib/videoStorage";

interface AdminVideoButtonProps {
  onVideoChange: (videoUrl: string | null) => void;
  currentVideo: string | null;
}

const AdminVideoButton = ({ onVideoChange, currentVideo }: AdminVideoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert("Video must be under 100MB");
      return;
    }

    setIsUploading(true);
    try {
      await saveVideo(file);
      const videoUrl = URL.createObjectURL(file);
      onVideoChange(videoUrl);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save video:", error);
      alert("Failed to save video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      await deleteVideo();
      onVideoChange(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  return (
    <>
      {/* Admin Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass-card p-3 rounded-full text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110"
        title="Admin Settings"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-8 rounded-2xl max-w-md w-full mx-4 border border-border/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl text-foreground">Change Background</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                Upload a video (max 100MB) to replace the hero background.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full glass-card glow-sakura px-6 py-4 flex items-center justify-center gap-3 font-body text-sm uppercase tracking-widest text-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Video</span>
                    </>
                  )}
                </button>

                {currentVideo && (
                  <button
                    onClick={handleReset}
                    className="w-full border border-border/50 bg-transparent px-6 py-4 flex items-center justify-center gap-3 font-body text-sm uppercase tracking-widest text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminVideoButton;
