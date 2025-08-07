"use client";

import {
  HEADER_AVATAR_SIZE_PX,
  HEADER_HEIGHT_PX,
  HEX_OPACITY_POSTFIX,
} from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useViewportSize, useWindowScroll } from "@mantine/hooks";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IconUser, IconUserCircle } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const auth = useAuth();
  const [scroll] = useWindowScroll();
  const { height } = useViewportSize();

  return (
    <header
      className="flex w-full px-6 py-5 items-center justify-center fixed transition-all duration-300 ease-in-out"
      style={{
        height: HEADER_HEIGHT_PX,
        boxShadow: scroll.y > 20 ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "none",
        backgroundColor:
          scroll.y > height ? "#09090b" : `#09090b${HEX_OPACITY_POSTFIX[25]}`,
      }}
    >
      <div className="flex justify-between items-center w-full max-w-7xl">
        <Link href="/">
          <span
            className="select-none cursor-pointer text-3xl font-bold"
            style={{
              backgroundImage:
                "linear-gradient(160deg, hsl(149, 90%, 12%), hsl(149, 90%, 80%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            acm.dev
          </span>
        </Link>
        <div className="flex justify-center items-center w-10 h-10 self-center">
          {!auth.loadingAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className="cursor-pointer"
                  style={{
                    width: HEADER_AVATAR_SIZE_PX,
                    height: HEADER_AVATAR_SIZE_PX,
                  }}
                >
                  <AvatarImage src={auth.user?.user_metadata.picture} />
                  <AvatarFallback>
                    {auth.user ? <IconUserCircle size={"100%"} /> : null}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              {auth.user ? (
                <DropdownMenuContent className="p-2">
                  <DropdownMenuLabel>
                    Welcome, {auth.user?.user_metadata.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={() => auth.signOut()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : null}
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
