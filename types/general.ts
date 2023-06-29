export type ViewMode = 'desktop' | 'mobile' | null

export type Address = {
  _id?: string
  name?: string
  type?: string
  city: string
  country?: string
  state: string
  line_1: string
  line_2: string
  country_code: string
  postal_code: string
  contact: {
    name: string
    phone?: string
    email?: string
  }
}

export type Dimension = {
  weight: number
  length: number
  width: number
  height: number
}

export type CanvasFont = {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: { [K: string]: string }
  category: string
  kind: string
}
export type LayerCornerRadius = {
  topLeft?: number
  topRight?: number
  bottomLeft?: number
  bottomRight?: number
}
export type LayerAction = {
  type:
  | "resize-top-left"
  | "resize-top-right"
  | "resize-bottom-left"
  | "resize-bottom-right"
  | "resize-top"
  | "resize-right"
  | "resize-bottom"
  | "resize-left"
  | "resize-start"
  | "resize-end"
  | "move"
  bounds: [[number, number], [number, number]]
}
export type LayerMask = {
  scale?: number
  mask: {
    url?: string
    w: number
    h: number
    x?: number
    y?: number
    image?: HTMLImageElement
  },
  background?: {
    url?: string
    w: number
    h: number
    image?: HTMLImageElement
  }
}
export type Layer = {
  id?: string
  overlay: boolean
  type: "rectangle" | "ellipse" | "line" | "text" | "image" | "outline" | "outline-line" | "outline-text"
  name?: string
  selected?: boolean
  hidden?: boolean
  x: number
  y: number
  w?: number
  h?: number
  r?: number
  image?: HTMLImageElement
  shape?: {
    radius?: LayerCornerRadius
    fill?: {
      color: string
      alpha: number
    }
    stroke?: {
      color: string
      alpha: number
      width: number
      dash: number
      gap: number
    }
  }
  font?: {
    family: string
    size: number
    variant: string
  }
}

export type InputSwitchOption = {
  options: [string, string] | string[]
  model: string
  disabled?: boolean
}
export type InputColorOption = {
  color: string
  alpha: number
}
export type InputToggleOption = {
  model: boolean
  disabled?: boolean
}
export type InputFileOption = {
  file: File
  type?: 'any' | 'image'
  disabled?: boolean
  label?: string
  image_url?: string
  width?: number
  height?: number
}
export type InputImageOption = {
  label: string
  limit: number
  file: (File | string)[]
}
export type InputOption = {
  name: string
  placeholder: string
  model: string
  prefix?: string
  icon?: string
  color?: string
  value?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number' | 'hour' | 'minute'
  disabled?: boolean
  options?: (string | {
    name: string
    value: string
  })[]
}
export type InputDateOption = {
  name?: string
  placeholder?: string
  model: string
  value?: string
  icon?: string
  label?: string
  error?: string
  disabled?: boolean
  threshold?: Date | [Date, Date]
  available?: number[]
}
export type InputTimeOption = {
  model: [number, number]
  label?: string
}
export type InputCodeOption = {
  name: string
  length: number
  model: string
  disabled?: boolean
}
export type InputSearchOption = {
  name: string
  placeholder: string
  model: string
  type?: 'primary' | 'secondary'
}
export type InputGeneric<T> = {
  name: string
  placeholder: string
  model: string
  value?: T
  icon?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number'
  disabled?: boolean
  options?: (string | {
    name: string
    value: T
  })[]
}