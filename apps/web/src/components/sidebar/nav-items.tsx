'use client'

import type { LucideIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export interface NavItemsProps {
  titleItems: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    // items?: {
    // 	title: string;
    // 	url: string;
    // }[];
  }[]
}

export function NavItems({ titleItems, items }: NavItemsProps) {
  const { open } = useSidebar()

  return (
    <SidebarGroup
      className={cn(!open && 'p-2 pb-0', open && 'py-0 first:pt-2 ')}
    >
      <SidebarGroupLabel>{titleItems}</SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
            >
              <Link to={item.url}>
                {item.icon && <item.icon className="size-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
