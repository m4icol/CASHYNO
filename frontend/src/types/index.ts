export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  role: string
  nombre: string
}

export type MenuItem = {
  icon:   string
  label:  string
  desc:   string
  accent: string  
}