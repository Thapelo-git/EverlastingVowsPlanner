import { useState, useEffect } from 'react';
import { X, Calendar, User, Paperclip, Send, Trash2, Download, FileText, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { base44 } from '@/api/base44Client';
import moment from 'moment';

const roleColors = {
  planner: 'bg-violet-100 text-violet-700',
  bride: 'bg-pink-100 text-pink-700',
  groom: 'bg-blue-100 text-blue-700',
  vendor: 'bg-orange-100 text-orange-700',
  other: 'bg-slate-100 text-slate-700',
};

const roleInitials = {
  planner: 'P',
  bride: 'B',
  groom: 'G',
  vendor: 'V',
  other: 'O',
};

export default function TaskDetailModal({ task, open, onClose, onUpdate, comments, onAddComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState('');
  const [commentRole, setCommentRole] = useState('planner');
  const [authorName, setAuthorName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const user = await base44.auth.me();
  //       setAuthorName(user.full_name || user.email?.split('@')[0] || 'User');
  //     } catch {
  //       setAuthorName('User');
  //     }
  //   };
  //   loadUser();
  // }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    await onAddComment({
      task_id: task.id,
      message: newComment.trim(),
      author_name: authorName,
      author_role: commentRole,
    });
    setNewComment('');
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setIsUploading(true);
  //   try {
  //     const { file_url } = await base44.integrations.Core.UploadFile({ file });
  //     const newAttachments = [...(task.attachments || []), file_url];
  //     await onUpdate(task.id, { attachments: newAttachments });
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //   }
  //   setIsUploading(false);
  // };

  const handleRemoveAttachment = async (urlToRemove) => {
    const newAttachments = (task.attachments || []).filter(url => url !== urlToRemove);
    await onUpdate(task.id, { attachments: newAttachments });
  };

  const getFileName = (url) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]).substring(0, 30);
    } catch {
      return 'File';
    }
  };

  const isImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-semibold text-slate-800 pr-8">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4">
            {task.due_date && (
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  Due: <span className="font-medium">{moment(task.due_date).format('MMMM D, YYYY')}</span>
                </span>
              </div>
            )}
            {task.assigned_to && (
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  Assigned to: <span className="font-medium">{task.assigned_to}</span>
                </span>
              </div>
            )}
          </div>

          {task.description && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-700 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </h4>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button variant="outline" size="sm" disabled={isUploading} asChild>
                  <span>{isUploading ? 'Uploading...' : 'Add File'}</span>
                </Button>
              </label>
            </div>
            {task.attachments?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {task.attachments.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 group">
                    {isImageUrl(url) ? (
                      <Image className="h-4 w-4 text-slate-400" />
                    ) : (
                      <FileText className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-xs text-slate-600 flex-1 truncate">{getFileName(url)}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="h-3 w-3" />
                      </Button>
                    </a>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600"
                      onClick={() => handleRemoveAttachment(url)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No attachments yet</p>
            )}
          </div>

          {/* Comments */}
          <div>
            <h4 className="font-medium text-slate-700 mb-3">Comments</h4>
            <div className="space-y-3 mb-4">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-400">No comments yet. Start the conversation!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <Avatar className={`h-8 w-8 ${roleColors[comment.author_role] || roleColors.other}`}>
                      <AvatarFallback className="text-xs font-medium">
                        {roleInitials[comment.author_role] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-700">
                            {comment.author_name || 'User'}
                          </span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleColors[comment.author_role]}`}>
                            {comment.author_role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">
                            {moment(comment.created_date).fromNow()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500"
                            onClick={() => onDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{comment.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-3">
              <Select value={commentRole} onValueChange={setCommentRole}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planner">Planner</SelectItem>
                  <SelectItem value="bride">Bride</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                  className="flex-1"
                />
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}