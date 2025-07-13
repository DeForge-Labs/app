export default function TemplateHeader() {
  return (
    <section className="py-16 md:py-20 dark:bg-black/20 bg-black/5">
      <div className="container text-center space-y-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter dark:text-background">
          Deforge{" "}
          <span className="text-black dark:text-background">Templates</span>
        </h1>
        <p className="text-black/60 text-lg max-w-2xl mx-auto dark:text-background">
          Discover AI agent templates handpicked by our team. Get started faster
          with these pre-built workflows for common use cases.
        </p>
      </div>
    </section>
  );
}
