export enum Permission {
  // Auth
  AuthCreate = 'auth:create',
  AuthRead = 'auth:read',
  AuthUpdate = 'auth:update',
  AuthDelete = 'auth:delete',

  // Users
  UsersCreate = 'users:create',
  UsersRead = 'users:read',
  UsersUpdate = 'users:update',
  UsersDelete = 'users:delete',

  // Roles
  RolesCreate = 'roles:create',
  RolesRead = 'roles:read',
  RolesUpdate = 'roles:update',
  RolesDelete = 'roles:delete',

  // UserTokens
  UserTokensCreate = 'user-tokens:create',
  UserTokensRead = 'user-tokens:read',
  UserTokensUpdate = 'user-tokens:update',
  UserTokensDelete = 'user-tokens:delete',

  // Permissions
  PermissionsCreate = 'permissions:create',
  PermissionsRead = 'permissions:read',
  PermissionsUpdate = 'permissions:update',
  PermissionsDelete = 'permissions:delete',

  // Championships
  ChampionshipsCreate = 'championships:create',
  ChampionshipsRead = 'championships:read',
  ChampionshipsUpdate = 'championships:update',
  ChampionshipsDelete = 'championships:delete',

  // Organizations
  OrganizationsCreate = 'organizations:create',
  OrganizationsRead = 'organizations:read',
  OrganizationsUpdate = 'organizations:update',
  OrganizationsDelete = 'organizations:delete',

  // OrganizationUsers
  OrganizationUsersCreate = 'organization-users:create',
  OrganizationUsersRead = 'organization-users:read',
  OrganizationUsersUpdate = 'organization-users:update',
  OrganizationUsersDelete = 'organization-users:delete',
}
