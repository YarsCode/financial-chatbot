import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat"); // Redirect to the chat page
}
