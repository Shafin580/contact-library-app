import { ModuleListProps } from "@library/molecules/navigation/SidebarProps"
import {
  MODULE_ONE_NAME_MODULE_LIST,
  MODULE_ONE_NAME_MODULE_PERMISSIONS,
  MODULE_ONE_NAME_MODULE_SLUG,
} from "app/(module)/module.config"

/**
 * All permissions available in the system is mapped here, to be used in the app for
 * access control. This eliminates the use of hard-coded strings and offers better type safety.
 */
export const APP_PERMISSIONS = {
  ...MODULE_ONE_NAME_MODULE_PERMISSIONS,
} as const

/**
 * All modules' slugs are mapped here, to be used in the app for module switching.
 */
export const MODULE_SLUG = {
  MODULE_ONE: MODULE_ONE_NAME_MODULE_SLUG,
} as const

export interface ModuleListPropsExtended extends ModuleListProps {
  isHidden?: boolean
  slug: (typeof MODULE_SLUG)[keyof typeof MODULE_SLUG]
}

export const ModuleList: ModuleListPropsExtended[] = [
  // + module one module list
  ...MODULE_ONE_NAME_MODULE_LIST,
]
