import AgentCarousel from "@/components/layout/dashboard/templates/AgentCarousel";
import SearchBox from "@/components/layout/dashboard/templates/SearchBox";
import DashboardCategoryList from "@/components/layout/dashboard/templates/AppCategoryList";

export default function TemplatesHeader({ categoryName }) {
  const pageTitle = categoryName
    ? `${categoryName} Templates`
    : "Global Templates";
  const pageDescription =
    "Explore our curated collection of pre-built AI agents and templates. Clone, customize, and deploy in seconds.";

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 relative w-full max-w-4xl mx-auto z-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {pageTitle}
      </h1>
      <p className="text-md text-foreground/70 max-w-xl text-center mb-8">
        {pageDescription}
      </p>

      <AgentCarousel />
      <SearchBox />
      <DashboardCategoryList />
    </div>
  );
}
