import { UserRoleAction } from './user-role'

interface UserBranch {
  _id: string
  name: string
  code: string
}

interface UserRole {
  _id: string
  name: string
  color: string
  action: UserRoleAction[]
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  image_url?: string
  branch?: UserBranch[]
  birth_date: Date
  create_date: Date
  role: UserRole[]
  status: 'active' | 'inactive'
}

export interface UserMin {
  _id: string
  name: string
  role: UserRole
  image_url?: string
}

export interface UserOverview {
  _id: string
  name: string
  image_url: string
  role: UserRole[]
  sale: {
    count: number
    value: number
  }
}

export interface UserRequest {
  role_id: string[]
  branch_id: string[]
  name: string
  email: string
  password: string
  birth_date: number
  file?: File
  phone?: string
}