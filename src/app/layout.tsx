import type { Metadata } from "next";
import { Athiti } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";

const athiti = Athiti({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "สถานะโครงร่างการวิจัยที่ยื่นขอรับรองจริยธรรมการวิจัย",
  description:
    "สถานะโครงร่างการวิจัยที่ยื่นขอรับรองจริยธรรมการวิจัย สำนักงานเลขานุการ คณะกรรมการจริยธรรมการวิจัย กรมควบคุมโรค",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${athiti.className} antialiased`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
