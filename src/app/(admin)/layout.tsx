import AdminLayoutClient from "./AdminLayoutClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayoutClient>{children}</AdminLayoutClient>
  );
}
