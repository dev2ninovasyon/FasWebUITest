import { uniqueId } from "lodash";

// Notifications dropdown

interface notificationType {
  avatar: string;
  title: string;
  subtitle: string;
}

const notifications: notificationType[] = [
  {
    avatar: "/images/profile/user-1.jpg",
    title: "Ahmet Uygulamaya Katıldı!",
    subtitle: "Tebrik et.",
  },
  /*{
    avatar: "/images/profile/user-2.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: "/images/profile/user-4.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {
    avatar: "/images/profile/user-1.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: "/images/profile/user-2.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: "/images/profile/user-3.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: "/images/profile/user-4.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },*/
];

// Profile dropdown

interface ProfileType {
  [x: string]: any;
  id?: string;
  href: string;
  title: string;
  subtitle?: string;
  icon: any;
  children?: ProfileType[];
}
const profile: ProfileType[] = [
  {
    id: uniqueId(),
    title: "Hesap Ayarları",
    icon: "/images/svgs/icon-settings.png",
    href: "/HesapAyarlari",
    subtitle: "Hesap kişiselleştirme",
  },
  {
    id: uniqueId(),
    title: "Tema Ayarları",
    icon: "/images/svgs/icon-settings2.png",
    href: "/TemaAyarlari",
    subtitle: "Tema kişiselleştirme",
  },
  {
    id: uniqueId(),
    title: "Kullanıcı",
    icon: "/images/svgs/icon-users2.png",
    href: "/Kullanici",
    subtitle: "Kullanıcılar ile ilgili işlemler",
    personal: true,
  },
];

// apps dropdown

interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}

const appsLink: appsLinkType[] = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "New messages arrived",
    avatar: "/images/svgs/icon-dd-chat.svg",
  },
  {
    href: "/apps/ecommerce/shop",
    title: "eCommerce App",
    subtext: "New stock available",
    avatar: "/images/svgs/icon-dd-cart.svg",
  },
  {
    href: "/apps/notes",
    title: "Notes App",
    subtext: "To-do and Daily tasks",
    avatar: "/images/svgs/icon-dd-invoice.svg",
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Get dates",
    avatar: "/images/svgs/icon-dd-date.svg",
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "2 Unsaved Contacts",
    avatar: "/images/svgs/icon-dd-mobile.svg",
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Submit tickets",
    avatar: "/images/svgs/icon-dd-lifebuoy.svg",
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "Get new emails",
    avatar: "/images/svgs/icon-dd-message-box.svg",
  },
  {
    href: "/apps/blog/post",
    title: "Blog App",
    subtext: "added new blog",
    avatar: "/images/svgs/icon-dd-application.svg",
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: "/theme-pages/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/auth1/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/auth1/register",
    title: "Register Now",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/apps/note",
    title: "Notes App",
  },
  {
    href: "/apps/user-profile/profile",
    title: "User Application",
  },
  {
    href: "/apps/blog/post",
    title: "Blog Design",
  },
  {
    href: "/apps/ecommerce/checkout",
    title: "Shopping Cart",
  },
];

export { notifications, profile, pageLinks, appsLink };
