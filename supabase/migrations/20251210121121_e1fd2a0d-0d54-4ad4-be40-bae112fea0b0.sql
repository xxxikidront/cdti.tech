-- Create table for news statistics
CREATE TABLE public.news_stats (
  id TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view news stats" 
ON public.news_stats 
FOR SELECT 
USING (true);

-- Create policy for public update access (for incrementing counters)
CREATE POLICY "Anyone can update news stats" 
ON public.news_stats 
FOR UPDATE 
USING (true);

-- Create policy for public insert access (for creating new stats)
CREATE POLICY "Anyone can insert news stats" 
ON public.news_stats 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_stats_updated_at
BEFORE UPDATE ON public.news_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment stats
CREATE OR REPLACE FUNCTION public.increment_news_stat(
  news_id TEXT,
  stat_type TEXT
)
RETURNS void AS $$
BEGIN
  -- Insert if not exists, otherwise update
  INSERT INTO public.news_stats (id, views, likes, shares)
  VALUES (news_id, 
    CASE WHEN stat_type = 'views' THEN 1 ELSE 0 END,
    CASE WHEN stat_type = 'likes' THEN 1 ELSE 0 END,
    CASE WHEN stat_type = 'shares' THEN 1 ELSE 0 END
  )
  ON CONFLICT (id) DO UPDATE SET
    views = news_stats.views + CASE WHEN stat_type = 'views' THEN 1 ELSE 0 END,
    likes = news_stats.likes + CASE WHEN stat_type = 'likes' THEN 1 ELSE 0 END,
    shares = news_stats.shares + CASE WHEN stat_type = 'shares' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to decrement likes
CREATE OR REPLACE FUNCTION public.decrement_news_like(news_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.news_stats 
  SET likes = GREATEST(0, likes - 1), updated_at = now()
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;