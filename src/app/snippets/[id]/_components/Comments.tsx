"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

interface CommentType {
  _id: string;
  snippetId: string;
  userId: string;
  userName: string;
  content: string;
  _creationTime: number;
}

function getAnonymousUserId(): string {
  let id = localStorage.getItem("anon-user-id");
  if (!id) {
    id = "anon-" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem("anon-user-id", id);
  }
  return id;
}

function Comments({ snippetId }: { snippetId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/snippets/${snippetId}/comments`);
    const data = await res.json();
    setComments(data);
  }, [snippetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true);
    const userId = getAnonymousUserId();
    const userName = localStorage.getItem("display-name") || "Anonymous";

    try {
      const res = await fetch(`/api/snippets/${snippetId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId, userName }),
      });
      if (!res.ok) throw new Error();
      await fetchComments();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(
        `/api/snippets/${snippetId}/comments?commentId=${commentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion ({comments.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        <CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />

        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              isDeleting={deletingCommentId === comment._id}
              currentUserId={getAnonymousUserId()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Comments;
