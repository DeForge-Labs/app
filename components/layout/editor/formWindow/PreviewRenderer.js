"use client";

export default function PreviewRenderer({ component }) {
  const renderComponent = () => {
    switch (component.type) {
      case "heading1":
        return (
          <h1 className="text-4xl font-bold dark:text-background text-dark mb-4">
            {component.content}
          </h1>
        );
      case "heading2":
        return (
          <h2 className="text-2xl font-bold dark:text-background text-dark mb-3">
            {component.content}
          </h2>
        );
      case "heading3":
        return (
          <h3 className="text-xl font-bold dark:text-background text-dark mb-2">
            {component.content}
          </h3>
        );
      case "paragraph":
        return (
          <p className="text-dark dark:text-background leading-relaxed mb-4 whitespace-pre-wrap">
            {component.content}
          </p>
        );
      case "link":
        return (
          <div className="mb-4">
            <a
              href={component.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              {component.content}
            </a>
          </div>
        );
      case "divider":
        return <hr className="border-dark dark:border-background my-6" />;
      default:
        return null;
    }
  };

  return <div>{renderComponent()}</div>;
}
