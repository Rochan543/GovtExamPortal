import { useListFeeds, getListFeedsQueryKey } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rss, Image } from "lucide-react";

export default function FeedsPage() {
  const params = { published: true };
  const { data: feeds, isLoading } = useListFeeds(params, {
    query: { queryKey: getListFeedsQueryKey(params) },
  });

  return (
    <Layout>
      <PageHeader title="News Feed" subtitle="Latest updates and announcements" />

      <div className="p-6 space-y-4 max-w-3xl">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
          </div>
        ) : (feeds ?? []).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Rss size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-base">No news posts available yet.</p>
            <p className="text-sm mt-1">Check back later for updates.</p>
          </div>
        ) : (
          (feeds ?? []).map((feed) => (
            <Card key={feed.id} className="overflow-hidden">
              {feed.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={feed.imageUrl}
                    alt={feed.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                  />
                </div>
              )}
              <CardContent className="pt-4 pb-5">
                <h2 className="text-base font-semibold text-foreground mb-2">{feed.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{feed.description}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(feed.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
}
