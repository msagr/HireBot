"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

function InterviewLink({ interview_id, formData }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${interview_id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (method) => {
    const shareData = {
      title: 'Interview Invitation',
      text: `You've been invited to an interview for ${formData.position || 'a position'}`,
      url: url,
    };

    try {
      if (method === 'email') {
        window.location.href = `mailto:?subject=Interview Invitation&body=You've been invited to an interview for ${formData.position || 'a position'}.%0D%0A%0D%0AClick here to start: ${url}`;
      } else if (method === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + '\n\n' + url)}`, '_blank');
      } else if (method === 'copy') {
        handleCopy();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!candidateEmail) return;
    
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Invitation sent to ${candidateEmail}`);
      setCandidateEmail('');
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-8 px-4 sm:px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Interview Created!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Share the interview link with candidates or invite them via email.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Interview Link Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/40 shadow-sm overflow-hidden"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold flex items-center gap-2 text-foreground/90">
                  <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Interview Link
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={url}
                      readOnly
                      className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm bg-background/50 border-border/40 rounded-lg font-mono"
                    />
                    <button
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-accent/50 transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <Button 
                    onClick={handleCopy}
                    size="sm"
                    className="shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-10 sm:h-11 text-sm"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>30 days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    <span>1:1</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/20 border-t border-border/30 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium">Created:</span> {new Date().toLocaleDateString()}
                </div>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-8 text-primary hover:bg-primary/10 px-2 sm:px-3">
                  Analytics <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Share Options */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/40 shadow-sm overflow-hidden"
          >
            <div className="p-5 sm:p-6">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-foreground/90">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Share
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleShare(option.name.toLowerCase())}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg ${option.color} hover:opacity-90 transition-opacity`}
                  >
                    <option.icon className={`h-5 w-5 mb-1.5 ${option.iconColor}`} />
                    <span className="text-xs font-medium text-foreground/80">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Email Invite */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/90 backdrop-blur-sm rounded-xl border border-border/40 shadow-sm overflow-hidden"
          >
            <div className="p-5 sm:p-6">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-foreground/90">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Invite via Email
              </h2>
              
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter candidate's email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" disabled={isSending} className="shrink-0">
                    {isSending ? 'Sending...' : 'Send Invite'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/interview/${interview_id}`} className="flex items-center gap-2">
              View Interview
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewLink;
