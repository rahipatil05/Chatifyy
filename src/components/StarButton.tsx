"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

// Generate or retrieve a persistent anonymous user ID per browser
function getAnonymousUserId(): string {
  let id = localStorage.getItem("anon-user-id");
  if (!id) {
    id = "anon-" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem("anon-user-id", id);
  }
  return id;
}

function StarButton({ snippetId }: { snippetId: string }) {
  const [isStarred, setIsStarred] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = getAnonymousUserId();
    fetch(`/api/snippets/${snippetId}/stars?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setIsStarred(data.isStarred);
        setCount(data.count);
      })
      .catch(console.error);
  }, [snippetId]);

  const handleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const userId = getAnonymousUserId();
    try {
      const res = await fetch(`/api/snippets/${snippetId}/stars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setIsStarred(data.isStarred);
      setCount(data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
    transition-all duration-200 ${
      isStarred
        ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
        : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
    }`}
      onClick={handleStar}
      disabled={loading}
    >
      <Star
        className={`w-4 h-4 ${isStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
      />
      <span className={`text-xs font-medium ${isStarred ? "text-yellow-500" : "text-gray-400"}`}>
        {count}
      </span>
    </button>
  );
}

export default StarButton;
