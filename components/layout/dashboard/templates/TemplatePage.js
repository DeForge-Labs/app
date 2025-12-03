import ErrorDialog from "@/components/ui/ErrorDialog";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { SquareArrowOutUpRightIcon, User } from "lucide-react";
import { GitBranch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import TemplateViewer from "./TemplateViewer";

export default async function TemplatePage({ id }) {
  const getNodeLibrary = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/node/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const getTemplate = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/template/get/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const nodeLibraryData = await getNodeLibrary();

  const templateData = await getTemplate();

  if (!templateData || !nodeLibraryData) {
    redirect("/server-not-found");
  }

  if (!templateData?.success || !nodeLibraryData?.success) {
    return (
      <ErrorDialog error={nodeLibraryData?.message || templateData?.message} />
    );
  }

  const nodeLibrary = nodeLibraryData?.nodes;

  const template = templateData?.template;

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/templates" />}
              className="text-[12px]"
            >
              Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink className="text-[12px]">
              {template?.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[12px]">
              {template?.name?.length > 20
                ? template?.name?.slice(0, 20) + "..."
                : template?.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-end gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">
            {template?.name?.length > 30
              ? template?.name?.slice(0, 30) + "..."
              : template?.name}
          </h1>
          <div className="flex gap-2 text-[10px] items-center">
            <Badge className="w-fit text-[10px] p-1 py-0.5">
              <GitBranch className="size-3" /> {template?.totalClones}
            </Badge>

            <Badge className="w-fit text-[10px] p-1 py-0.5">
              <User className="size-3" /> {template?.author}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="text-xs rounded-sm gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 shadow-md"
          >
            <SquareArrowOutUpRightIcon />
            Share
          </Button>

          <Button className="text-xs rounded-sm gap-1.5 px-3 [&_svg:not([class*='size-'])]:size-3 border border-foreground/50 shadow-[#8754ff] shadow-md">
            Open in{" "}
            <span>
              <Image
                src="/logo/logo-white.svg"
                alt="Deforge"
                width={14}
                height={14}
                className="dark:invert ml-[1px]"
              />
            </span>
          </Button>
        </div>
      </div>

      <TemplateViewer
        defaultView={template?.type?.toLowerCase()}
        components={template?.form?.formLayout?.components}
        nodes={template?.workflow?.nodes}
        edges={template?.workflow?.edges}
        nodeLibrary={nodeLibrary}
      />

      <div className="flex flex-col max-w-[600px] gap-2">
        <p className="text-[12px] font-semibold">About</p>
        <p className="text-[12px] text-muted-foreground">
          {template?.description}
        </p>

        <p className="text-[12px] font-semibold mt-4">Category</p>
        <Badge className="w-fit text-[12px] p-1 py-0.5">
          {template?.category}
        </Badge>

        <Separator className="mt-4 mb-2" />

        <p className="text-[12px] text-muted-foreground pb-6">
          Published at {new Date(template?.createdAt).toLocaleString()}
        </p>
      </div>
    </>
  );
}
