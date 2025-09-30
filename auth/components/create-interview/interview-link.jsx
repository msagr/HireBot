"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
  Copy, Clock, Mail, ArrowLeft, Plus, CheckCircle, Share2, Check,
  Zap, User, Calendar, Link as LinkIcon, ChevronRight, Edit3,
  Users as UsersIcon, Settings, Trash2, HelpCircle
} from "lucide-react";
import {
  FaWhatsapp,
  FaSlack,
  FaLinkedin,
  FaTwitter,
  FaLink,
  FaMicrosoft,
  FaFileExcel
} from "react-icons/fa";

const shareOptions = [
  { name: 'Email', icon: Mail, color: 'bg-rose-100', iconColor: 'text-rose-600' },
  { name: 'Slack', icon: FaSlack, color: 'bg-purple-100', iconColor: 'text-purple-600' },
  { name: 'WhatsApp', icon: FaWhatsapp, color: 'bg-green-100', iconColor: 'text-green-600' },
  { name: 'LinkedIn', icon: FaLinkedin, color: 'bg-blue-100', iconColor: 'text-blue-600' },
  { name: 'Twitter', icon: FaTwitter, color: 'bg-sky-100', iconColor: 'text-sky-500' },
  { name: 'Teams', icon: FaMicrosoft, color: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { name: 'Sheets', icon: FaFileExcel, color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { name: 'Copy', icon: FaLink, color: 'bg-amber-100', iconColor: 'text-amber-600' },
];

const fetchLatestInterviewId = async () => {
  try {
    const res = await fetch("/api/interviews/latest");
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to get interview ID");
      return null;
    }
    return data.interviewId;
  } catch (err) {
    console.error("❌ Error fetching latest interview ID:", err);
    toast.error("Could not fetch interview ID");
    return null;
  }
};

function InterviewLink({ formData }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [interviewUrl, setInterviewUrl] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const loadInterviewUrl = async () => {
      const id = await fetchLatestInterviewId();
      if (id) {
        const url = `${process.env.NEXT_PUBLIC_HOST_URL}/${id}`;
        setInterviewUrl(url);
      }
    };
    loadInterviewUrl();
  }, []);

  const handleCopy = async () => {
    try {
      const textToCopy = inputRef.current?.value || interviewUrl;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async (method) => {
    const shareData = {
      title: "Interview Invitation",
      text: `You've been invited to an interview for ${formData.position || "a position"}`,
      url: interviewUrl,
    };

    try {
      if (method === "email") {
        window.location.href = `mailto:?subject=Interview Invitation&body=You've been invited to an interview for ${formData.position || "a position"}.%0D%0A%0D%0AClick here to start: ${interviewUrl}`;
      } else if (method === "whatsapp") {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + "\n\n" + interviewUrl)}`, "_blank");
      } else if (method === "copy") {
        handleCopy();
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!candidateEmail) return;

    setIsSending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Invitation sent to ${candidateEmail}`);
      setCandidateEmail("");
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 mb-3">
            Interview Created Successfully!
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share the interview link with candidates or invite them directly via email.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Interview Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Link Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    Interview Link
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Input
                        value={interviewUrl}
                        ref={inputRef}
                        readOnly
                        className="w-full pl-4 pr-12 py-3 bg-background/50 border-border/60 rounded-lg font-mono text-sm"
                        disabled={!interviewUrl}
                      />
                      <button
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-accent transition-colors"
                        title="Copy link"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <Button
                      onClick={handleCopy}
                      className="shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                      disabled={!interviewUrl}
                    >
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Expires in 30 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Medium Level</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>1:1 Interview</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border-t border-border/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Created:</span>{" "}
                    {new Date().toLocaleDateString()}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    View Analytics <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Share Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Share Options
                </h2>

                <div className="space-y-6">
                  {/* Tabs */}
                  <div className="border-b border-border/50">
                    <div className="flex -mb-px">
                      <button
                        onClick={() => setActiveTab("link")}
                        className={`py-3 px-4 text-sm font-medium border-b-2 ${
                          activeTab === "link"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                        }`}
                      >
                        Share Link
                      </button>
                      <button
                        onClick={() => setActiveTab("email")}
                        className={`py-3 px-4 text-sm font-medium border-b-2 ${
                          activeTab === "email"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                        }`}
                      >
                        Invite via Email
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="pt-2"
                    >
                      {activeTab === "link" ? (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-4">
                            Share via platforms
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {shareOptions.map((option) => (
                              <button
                                key={option.name}
                                onClick={() =>
                                  handleShare(option.name.toLowerCase().replace(" ", "-"))
                                }
                                className="flex flex-col items-center justify-center p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors"
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${option.color}`}
                                >
                                  <option.icon className={`h-5 w-5 ${option.iconColor}`} />
                                </div>
                                <span className="text-xs font-medium text-center">
                                  {option.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSendInvite} className="space-y-4">
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-muted-foreground mb-2"
                            >
                              Candidate's Email
                            </label>
                            <div className="flex gap-2">
                              <Input
                                id="email"
                                type="email"
                                placeholder="candidate@example.com"
                                value={candidateEmail}
                                onChange={(e) => setCandidateEmail(e.target.value)}
                                required
                                className="flex-1"
                              />
                              <Button type="submit" disabled={isSending}>
                                {isSending ? "Sending..." : "Send Invite"}
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            We'll send an email with the interview link and instructions to the
                            candidate.
                          </p>
                        </form>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Interview Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Interview Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
                  <p className="font-medium">{formData.position || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Interview Type
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Technical Interview</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                  <p className="font-medium">30 minutes</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Actions
              </h2>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit Interview
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <UsersIcon className="h-4 w-4" />
                  Add Team Members
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  Interview Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Interview
                </Button>
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100 p-6 text-center"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Our support team is here to help you with any questions.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                Contact Support
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewLink;
