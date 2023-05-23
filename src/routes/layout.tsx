import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import clsx from "clsx";

export default component$(() => {
  return (
    <div class="grid grid-cols-4 mx-auto max-w-7xl divide divide-gray-100">
      <SidebarLinkList />
      <div class="col-span-2 flex flex-col min-h-screen border-x border-gray-100">
        <Slot />
      </div>
      <div class="col-span-1">Something</div>
    </div>
  );
});

const SidebarLinkListElement = component$<{
  text: string;
  icon: string;
  href: string;
}>((props) => {
  const loc = useLocation();

  return (
    <Link
      href={props.href}
      class={clsx(
        "flex items-center gap-4 rounded-full transition duration-75 cursor-pointer hover:bg-gray-50 p-2 w-max",
        (loc.url.pathname === props.href ||
          loc.url.pathname === `${props.href}/`) &&
          "font-bold"
      )}
    >
      <span>{props.icon}</span>
      <p class="text-xl">{props.text}</p>
    </Link>
  );
});

const SidebarLinkList = component$(() => {
  return (
    <div class="col-span-1 flex flex-col gap-2">
      <div class="w-16 h-16 bg-blue-100 flex items-center justify-center">
        G
      </div>
      <SidebarLinkListElement text="Home" icon="A" href="/" />
      <SidebarLinkListElement text="Explore" icon="A" href="/explore" />
      <SidebarLinkListElement
        text="Notifications"
        icon="A"
        href="/notifications"
      />
    </div>
  );
});
