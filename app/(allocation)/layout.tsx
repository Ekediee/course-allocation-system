'use client'
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import { AppWrapper } from '../../contexts/ContextProvider'
import PageWrapper from '../../components/PageWrapper'
import { Providers } from "../../components/queryPrivider"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter'  });

const metadata: Metadata = {
  title: "Course Allocation",
  description: "This is the course allocation system",
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className={`${inter.variable}`}>
          <Providers>
            <AppWrapper>
              <PageWrapper>{children}</PageWrapper>
            </AppWrapper>
          </Providers>
        </body>
      </html>
    );
  }