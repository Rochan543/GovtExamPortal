import { useListPapers, getListPapersQueryKey } from "@workspace/api-client-react";
import { Layout, PageHeader } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, ExternalLink } from "lucide-react";

export default function PapersPage() {
  const params = {};
  const { data: papers, isLoading } = useListPapers(params, {
    query: { queryKey: getListPapersQueryKey(params) },
  });

  return (
    <Layout>
      <PageHeader title="Previous Year Papers" subtitle="Download and practice from past exam papers" />

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded" />)}
          </div>
        ) : !papers || papers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>No papers available yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {papers.map((paper) => (
              <Card key={paper.id} data-testid={`card-paper-${paper.id}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{paper.title}</h3>
                      {paper.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{paper.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{paper.examType}</Badge>
                        {paper.year && <Badge variant="outline" className="text-xs">{paper.year}</Badge>}
                        <Badge variant="outline" className="text-xs uppercase">{paper.fileType}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        data-testid={`button-view-${paper.id}`}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(paper.fileUrl, "_blank")}
                      >
                        <ExternalLink size={12} className="mr-1" /> View
                      </Button>
                      <Button
                        data-testid={`button-download-${paper.id}`}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = paper.fileUrl;
                          a.download = paper.fileName ?? "paper";
                          a.click();
                        }}
                      >
                        <Download size={12} className="mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
