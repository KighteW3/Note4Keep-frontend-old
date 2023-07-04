import { useState, useEffect } from "react";
import { host } from "../components/host";

interface resultInfo {
  ok: boolean;
  userInfo: {
    username: string;
    email: string;
  };
}

const useAuth = () => {
  const [authData, setAuthData] = useState<resultInfo>({
    ok: false,
    userInfo: {
      username: "No logged",
      email: "No email",
    },
  });

  useEffect(() => {
    const tokenString = window.localStorage.getItem("SESSION_ID") || null;

    if (tokenString) {
      const token = JSON.parse(tokenString);

      (async () => {
        const URL = `http://${host}:5722/api/users/check`;

        const result = await fetch(URL, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token.token}`,
          },
        });

        const data = await result.json();

        const dataToReturn = {
          ok: result.ok ? true : false,
          userInfo: {
            username:
              result.ok && data.result.username
                ? data.result.username
                : "No logged",
            email:
              result.ok && data.result.email ? data.result.email : "No email",
          },
        };

        setAuthData(dataToReturn);
      })();
    } else {
      const dataToReturn = {
        ok: false,
        userInfo: {
          username: "No logged",
          email: "No email",
        },
      };

      setAuthData(dataToReturn);
    }
  }, []);

  return authData;
};

export { useAuth };
