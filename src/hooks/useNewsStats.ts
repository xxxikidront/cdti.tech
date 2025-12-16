import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NewsStats {
  views: number;
  likes: number;
  shares: number;
}

export const useNewsStats = (newsId: string) => {
  const [stats, setStats] = useState<NewsStats>({ views: 0, likes: 0, shares: 0 });
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // Check if user already liked this news (using localStorage)
  useEffect(() => {
    const likedNews = JSON.parse(localStorage.getItem("likedNews") || "[]");
    setLiked(likedNews.includes(newsId));
  }, [newsId]);

  // Fetch stats from database
  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("news_stats")
        .select("views, likes, shares")
        .eq("id", newsId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching stats:", error);
        return;
      }

      if (data) {
        setStats({
          views: data.views,
          likes: data.likes,
          shares: data.shares,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Increment view count
  const incrementView = useCallback(async () => {
    const viewedNews = JSON.parse(sessionStorage.getItem("viewedNews") || "[]");
    if (viewedNews.includes(newsId)) return;

    try {
      await supabase.rpc("increment_news_stat", {
        news_id: newsId,
        stat_type: "views",
      });

      sessionStorage.setItem("viewedNews", JSON.stringify([...viewedNews, newsId]));
      setStats((prev) => ({ ...prev, views: prev.views + 1 }));
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  }, [newsId]);

  // Toggle like
  const toggleLike = useCallback(async () => {
    const likedNews = JSON.parse(localStorage.getItem("likedNews") || "[]");

    try {
      if (liked) {
        await supabase.rpc("decrement_news_like", { news_id: newsId });
        localStorage.setItem(
          "likedNews",
          JSON.stringify(likedNews.filter((id: string) => id !== newsId))
        );
        setStats((prev) => ({ ...prev, likes: Math.max(0, prev.likes - 1) }));
      } else {
        await supabase.rpc("increment_news_stat", {
          news_id: newsId,
          stat_type: "likes",
        });
        localStorage.setItem("likedNews", JSON.stringify([...likedNews, newsId]));
        setStats((prev) => ({ ...prev, likes: prev.likes + 1 }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }, [newsId, liked]);

  // Increment share count
  const incrementShare = useCallback(async () => {
    try {
      await supabase.rpc("increment_news_stat", {
        news_id: newsId,
        stat_type: "shares",
      });
      setStats((prev) => ({ ...prev, shares: prev.shares + 1 }));
    } catch (error) {
      console.error("Error incrementing share:", error);
    }
  }, [newsId]);

  return {
    stats,
    loading,
    liked,
    incrementView,
    toggleLike,
    incrementShare,
  };
};
