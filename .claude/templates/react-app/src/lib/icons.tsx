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
  DashboardSquare01Icon as _DashboardSquare01,
  LayoutLeftIcon        as _LayoutLeft,
  Moon02Icon            as _Moon02,
  Sun03Icon             as _Sun03,
  Logout01Icon          as _Logout01,
  ArrowDown01Icon       as _ArrowDown01,
  ArrowUp01Icon         as _ArrowUp01,
  Home01Icon            as _Home01,
  ArrowRight01Icon      as _ArrowRight01,
  ArrowLeft01Icon       as _ArrowLeft01,
  UserGroupIcon         as _UserGroup,
  File01Icon            as _File01,
  Image01Icon           as _Image01,
  Search01Icon          as _Search01,
  PlusSignIcon          as _PlusSign,
  Edit01Icon            as _Edit01,
  Delete01Icon          as _Delete01,
  Cancel01Icon          as _Cancel01,
  Tick01Icon            as _Tick01,
  EyeIcon               as _Eye,
  EyeOffIcon            as _EyeOff,
  InformationCircleIcon as _InformationCircle,
  AlertCircleIcon       as _AlertCircle,
  CheckmarkCircle01Icon as _CheckmarkCircle01,
  Settings01Icon        as _Settings01,
  UploadSquare01Icon    as _UploadSquare01,
  PdfIcon               as _Pdf,
  Doc01Icon             as _Doc01,
  Xls01Icon             as _Xls01,
  FileZipIcon           as _FileZip,
  InsertColumnLeftIcon  as _InsertColumnLeft,
  UserAccount01Icon     as _UserAccount01,
  Add01Icon             as _Add01,
  PencilEdit01Icon      as _PencilEdit01,
} from '@hugeicons/core-free-icons'
import type { FC } from 'react'

type IconData = Parameters<typeof HugeiconsIcon>[0]['icon']

function wrap(data: IconData): FC<HugeiconsProps> {
  const Comp: FC<HugeiconsProps> = (props) => <HugeiconsIcon icon={data} {...props} />
  return Comp
}

export const DashboardSquare01Icon = wrap(_DashboardSquare01)
export const LayoutLeftIcon        = wrap(_LayoutLeft)
export const Moon02Icon            = wrap(_Moon02)
export const Sun03Icon             = wrap(_Sun03)
export const Logout01Icon          = wrap(_Logout01)
export const ArrowDown01Icon       = wrap(_ArrowDown01)
export const ArrowUp01Icon         = wrap(_ArrowUp01)
export const Home01Icon            = wrap(_Home01)
export const ArrowRight01Icon      = wrap(_ArrowRight01)
export const ArrowLeft01Icon       = wrap(_ArrowLeft01)
export const UserGroupIcon         = wrap(_UserGroup)
export const File01Icon            = wrap(_File01)
export const Image01Icon           = wrap(_Image01)
export const Search01Icon          = wrap(_Search01)
export const PlusSignIcon          = wrap(_PlusSign)
export const Edit01Icon            = wrap(_Edit01)
export const Delete01Icon          = wrap(_Delete01)
export const Cancel01Icon          = wrap(_Cancel01)
export const Tick01Icon            = wrap(_Tick01)
export const EyeIcon               = wrap(_Eye)
export const EyeOffIcon            = wrap(_EyeOff)
export const InformationCircleIcon = wrap(_InformationCircle)
export const AlertCircleIcon       = wrap(_AlertCircle)
export const CheckmarkCircle01Icon = wrap(_CheckmarkCircle01)
export const Settings01Icon        = wrap(_Settings01)
export const UploadSquare01Icon    = wrap(_UploadSquare01)
export const PdfIcon               = wrap(_Pdf)
export const Doc01Icon             = wrap(_Doc01)
export const Xls01Icon             = wrap(_Xls01)
export const FileZipIcon           = wrap(_FileZip)
export const InsertColumnLeftIcon  = wrap(_InsertColumnLeft)
export const UserAccountIcon       = wrap(_UserAccount01)
export const Add01Icon             = wrap(_Add01)
export const PencilEdit01Icon      = wrap(_PencilEdit01)
