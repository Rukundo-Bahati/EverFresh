import { Redirect } from "expo-router";
import { isAuthenticated } from "../constants/sessionStore";

export default function IndexScreen() {
  return <Redirect href={isAuthenticated() ? "/dashboard" : "/auth/login"} />;
}
