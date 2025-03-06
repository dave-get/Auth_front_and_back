export interface data {
  user: {
    sussess: boolean;
    token: infoType;
    message: string;
  }
}

export interface infoType {
  name: string
  user_id: string
  email: string
  image: string
  verified: boolean
}

export interface userType{
  email: string;
  password: string;
}