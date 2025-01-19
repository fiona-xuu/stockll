import { useSignOut } from "@gadgetinc/react";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import { User, Users, Mail, LogOut } from "lucide-react";
import type { RootOutletContext } from "../root";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { session, gadgetConfig } = context;

  const userId = session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  if (!user) {
    return redirect(gadgetConfig.authentication!.signInPath);
  }

  return json({
    user,
  });
};

export type AuthOutletContext = RootOutletContext & {
  user: any;
};

const UserMenu = () => {
  const { user } = useLoaderData<typeof loader>();
  const [userMenuActive, setUserMenuActive] = useState(false);
  const signOut = useSignOut();

  const getInitials = () => {
    return (
      (user.firstName?.slice(0, 1) ?? "") +
      (user.lastName?.slice(0, 1) ?? "")
    ).toUpperCase();
  };

  return (
    <DropdownMenu
      open={userMenuActive}
      onOpenChange={setUserMenuActive}
    >
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent">
          <Avatar>
            {user.profilePicture?.url ? (
              <AvatarImage src={user.profilePicture.url} alt={user.firstName ?? user.email} />
            ) : (
              <AvatarFallback>{getInitials()}</AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">
            {user.firstName ?? user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/team"
            className="flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Team
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/invite"
            className="flex items-center"
          >
            <Mail className="mr-2 h-4 w-4" />
            Invite
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={signOut}
          className="flex items-center text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function() {
  const { user } = useLoaderData<typeof loader>();
  const rootOutletContext = useOutletContext<RootOutletContext>();

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <svg 
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" 
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span
                className="text-xl font-semibold tracking-tight font-sans">STOCKL
              </span> 
            </Link>
          </div>
          <div className="ml-auto flex items-center">
            <Link to="/my-portfolio" className="text-md font-medium px-4 py-2 hover:text-foreground/80 hover:underline mr-4">
              My Portfolio
            </Link>
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">
            <Outlet context={{ ...rootOutletContext, user } as AuthOutletContext} />
            <Toaster />
          </div>
        </main>
      </div>
    </div>
  );
}
