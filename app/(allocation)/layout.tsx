'use client'

import { AppWrapper } from '../../contexts/ContextProvider'
import PageWrapper from '../../components/PageWrapper'
import { Providers } from "../../components/queryPrivider"

export default function AllocationLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <Providers>
            <AppWrapper>
                <PageWrapper>{children}</PageWrapper>
            </AppWrapper>
        </Providers>
    );
  }