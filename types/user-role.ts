export type UserRoleAction =
  'create-user' |
  'update-user' |
  'delete-user' |
  'read-user' |
  'create-role' |
  'update-role' |
  'delete-role' |
  'read-role' |
  'create-branch' |
  'update-branch' |
  'delete-branch' |
  'read-branch' |
  'create-product' |
  'update-product' |
  'delete-product' |
  'read-product' |
  'create-supplier' |
  'update-supplier' |
  'delete-supplier' |
  'read-supplier' |
  'create-customer' |
  'update-customer' |
  'delete-customer' |
  'read-customer' |
  'create-stock' |
  'update-stock' |
  'approve-transaction' |
  'deliver-transaction' |
  'receive-transaction' |
  'cancel-transaction' |
  'pay-transaction' |
  'create-transaction' |
  'update-transaction' |
  'delete-transaction' |
  'read-transaction' |
  'all'

export interface UserRole {
  _id: string
  name: string
  color: string
  action: UserRoleAction[]
  owner: boolean
  count?: number
}

export interface UserRoleRequest {
  name: string
  color: string
  action: UserRoleAction[]
}