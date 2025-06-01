import { useRouter } from "next/router";
import { useEffect } from "react";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const { token, user, message, success } = router.query;

    if (success === "true" && token && user) {
      // Decode and parse the user data (since it’s URI-encoded in the backend)
      const decodedUser = JSON.parse(decodeURIComponent(user as string));

      // Store the token and user data in localStorage (or another state solution)
      localStorage.setItem("token", token as string);
      localStorage.setItem("user", JSON.stringify(decodedUser));

      // Optionally log the message for debugging
      console.log(
        "Message from backend:",
        decodeURIComponent(message as string)
      );

      // Redirect to home or dashboard
      router.push("/");
    }
  }, [router.query]);

  return <div>Loading...</div>;
};

export default Callback;
