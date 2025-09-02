import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import React from "react";

type Page = {
  title: string;
  link: string;
};
type Props = {
  previousPages: Page[];
  currentPage: Omit<Page, "link">;
};

export function BreadcrumbBuilder({ previousPages, currentPage }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {previousPages.map((page, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <Link href={page.link}>{page.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
