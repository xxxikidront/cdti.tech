import { ArrowUpRight } from "lucide-react";

interface NewsListItemProps {
  title: string;
  date: string;
  onClick: () => void;
}

export const NewsListItem = ({ title, date, onClick }: NewsListItemProps) => {
  const formattedDate = new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article
      className="py-6 flex flex-col md:flex-row md:items-center justify-between group cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4 md:mb-0">
        <span className="text-xs font-medium text-muted-foreground mb-2 block">
          {formattedDate}
        </span>
        <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-accent transition-colors">
        <span className="text-sm">Читать</span>
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </article>
  );
};
