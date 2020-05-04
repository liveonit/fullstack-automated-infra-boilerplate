export type Env = "development" | "staging" | "production"

export const isEnv = (value: string = ""): value is Env  => {
  switch(value) {
    case "develoment":
    case "staging":
    case "production":
      return true;
    default:
      return false;
  }
}