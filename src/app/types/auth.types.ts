export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  address?: string
  created_at?: string
}

export interface AuthContextType {
  profile: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}