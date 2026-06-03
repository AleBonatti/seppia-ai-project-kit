// Thin adapter for @hugeicons/react v1.x + @hugeicons/core-free-icons.
// @hugeicons/react only exports the HugeiconsIcon renderer; individual icon
// data ships in @hugeicons/core-free-icons. This file wraps each data object
// into a proper React component so the rest of the app can import icons by
// name without caring about the split-package setup.
//
// Usage: import { DashboardSquare01Icon } from '@/lib/icons'
//        <DashboardSquare01Icon size={20} strokeWidth={1.8} />

import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'
import {
  dashboardSquare01 as DashboardSquare01,
  layoutLeft as LayoutLeft,
  moon02 as Moon02,
  sun03 as Sun03,
  logout01 as Logout01,
  arrowDown01 as ArrowDown01,
  home01 as Home01,
  arrowRight01 as ArrowRight01,
  arrowLeft01 as ArrowLeft01,
  userGroup as UserGroup,
  file01 as File01,
  image01 as Image01,
  search01 as Search01,
  plus as Plus,
  edit01 as Edit01,
  delete01 as Delete01,
  cancel01 as Cancel01,
  tick01 as Tick01,
  informationCircle as InformationCircle,
  alertCircle as AlertCircle,
  checkmarkCircle01 as CheckmarkCircle01,
  settings01 as Settings01,
} from '@hugeicons/core-free-icons'
import type { FC } from 'react'

function wrap(data: object): FC<HugeiconsProps> {
  const Comp: FC<HugeiconsProps> = (props) => <HugeiconsIcon icon={data} {...props} />
  return Comp
}

export const DashboardSquare01Icon = wrap(DashboardSquare01)
export const LayoutLeftIcon        = wrap(LayoutLeft)
export const Moon02Icon            = wrap(Moon02)
export const Sun03Icon             = wrap(Sun03)
export const Logout01Icon          = wrap(Logout01)
export const ArrowDown01Icon       = wrap(ArrowDown01)
export const Home01Icon            = wrap(Home01)
export const ArrowRight01Icon      = wrap(ArrowRight01)
export const ArrowLeft01Icon       = wrap(ArrowLeft01)
export const UserGroupIcon         = wrap(UserGroup)
export const File01Icon            = wrap(File01)
export const Image01Icon           = wrap(Image01)
export const Search01Icon          = wrap(Search01)
export const PlusIcon              = wrap(Plus)
export const Edit01Icon            = wrap(Edit01)
export const Delete01Icon          = wrap(Delete01)
export const Cancel01Icon          = wrap(Cancel01)
export const Tick01Icon            = wrap(Tick01)
export const InformationCircleIcon = wrap(InformationCircle)
export const AlertCircleIcon       = wrap(AlertCircle)
export const CheckmarkCircle01Icon = wrap(CheckmarkCircle01)
export const Settings01Icon        = wrap(Settings01)
