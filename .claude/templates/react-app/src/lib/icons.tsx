// Thin adapter for @hugeicons/react v1.x + @hugeicons/core-free-icons.
//
// WHY per-icon imports, not the barrel:
//   @hugeicons/core-free-icons declares "type":"module" and an ESM exports map,
//   but the ESM barrel (dist/esm/index.js) does not exist in the installed
//   package. Vite falls through to the CJS barrel (dist/cjs/index.js), which
//   is ~20 MB of icon data and causes the WASM parser to OOM during dev startup.
//   The per-icon ESM files (dist/esm/icons/FooIcon.js) DO exist and are tiny,
//   but each only exports `default`, so they must be default-imported.
//
//   ✅ import _Foo from '@hugeicons/core-free-icons/dist/esm/icons/FooIcon'
//   ❌ import { FooIcon } from '@hugeicons/core-free-icons'   ← OOM / broken
//
// When adding a new icon:
//   1. Find the icon name on hugeicons.com (e.g. "Calendar01")
//   2. Add a default import from its ESM file below
//   3. Add a named export via wrap() at the bottom
//
// Usage: import { CalendarIcon } from '@/lib/icons'
//        <CalendarIcon size={20} strokeWidth={1.8} />

import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'
import _DashboardSquare01  from '@hugeicons/core-free-icons/dist/esm/icons/DashboardSquare01Icon'
import _LayoutLeft         from '@hugeicons/core-free-icons/dist/esm/icons/LayoutLeftIcon'
import _Moon02             from '@hugeicons/core-free-icons/dist/esm/icons/Moon02Icon'
import _Sun03              from '@hugeicons/core-free-icons/dist/esm/icons/Sun03Icon'
import _Logout01           from '@hugeicons/core-free-icons/dist/esm/icons/Logout01Icon'
import _ArrowDown01        from '@hugeicons/core-free-icons/dist/esm/icons/ArrowDown01Icon'
import _ArrowUp01          from '@hugeicons/core-free-icons/dist/esm/icons/ArrowUp01Icon'
import _Home01             from '@hugeicons/core-free-icons/dist/esm/icons/Home01Icon'
import _ArrowRight01       from '@hugeicons/core-free-icons/dist/esm/icons/ArrowRight01Icon'
import _ArrowLeft01        from '@hugeicons/core-free-icons/dist/esm/icons/ArrowLeft01Icon'
import _UserGroup          from '@hugeicons/core-free-icons/dist/esm/icons/UserGroupIcon'
import _File01             from '@hugeicons/core-free-icons/dist/esm/icons/File01Icon'
import _Image01            from '@hugeicons/core-free-icons/dist/esm/icons/Image01Icon'
import _Search01           from '@hugeicons/core-free-icons/dist/esm/icons/Search01Icon'
import _PlusSign           from '@hugeicons/core-free-icons/dist/esm/icons/PlusSignIcon'
import _Add01              from '@hugeicons/core-free-icons/dist/esm/icons/Add01Icon'
import _Edit01             from '@hugeicons/core-free-icons/dist/esm/icons/Edit01Icon'
import _PencilEdit01       from '@hugeicons/core-free-icons/dist/esm/icons/PencilEdit01Icon'
import _Delete01           from '@hugeicons/core-free-icons/dist/esm/icons/Delete01Icon'
import _Cancel01           from '@hugeicons/core-free-icons/dist/esm/icons/Cancel01Icon'
import _Tick01             from '@hugeicons/core-free-icons/dist/esm/icons/Tick01Icon'
import _Eye                from '@hugeicons/core-free-icons/dist/esm/icons/EyeIcon'
import _EyeOff             from '@hugeicons/core-free-icons/dist/esm/icons/EyeOffIcon'
import _InformationCircle  from '@hugeicons/core-free-icons/dist/esm/icons/InformationCircleIcon'
import _AlertCircle        from '@hugeicons/core-free-icons/dist/esm/icons/AlertCircleIcon'
import _CheckmarkCircle01  from '@hugeicons/core-free-icons/dist/esm/icons/CheckmarkCircle01Icon'
import _Settings01         from '@hugeicons/core-free-icons/dist/esm/icons/Settings01Icon'
import _UploadSquare01     from '@hugeicons/core-free-icons/dist/esm/icons/UploadSquare01Icon'
import _Pdf                from '@hugeicons/core-free-icons/dist/esm/icons/PdfIcon'
import _Doc01              from '@hugeicons/core-free-icons/dist/esm/icons/Doc01Icon'
import _Xls01              from '@hugeicons/core-free-icons/dist/esm/icons/Xls01Icon'
import _FileZip            from '@hugeicons/core-free-icons/dist/esm/icons/FileZipIcon'
import _InsertColumnLeft   from '@hugeicons/core-free-icons/dist/esm/icons/InsertColumnLeftIcon'
import _UserAccount01      from '@hugeicons/core-free-icons/dist/esm/icons/UserAccount01Icon'
import _Calendar01         from '@hugeicons/core-free-icons/dist/esm/icons/Calendar01Icon'
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
export const Add01Icon             = wrap(_Add01)
export const Edit01Icon            = wrap(_Edit01)
export const PencilEdit01Icon      = wrap(_PencilEdit01)
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
export const CalendarIcon          = wrap(_Calendar01)
