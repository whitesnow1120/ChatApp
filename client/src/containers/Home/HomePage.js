import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";

import history from "../../utils/history";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const HomePage = () => {
  const [page, setPage] = useState("login");

  const handleClick = (location) => {
    setPage(location);
  };

  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      history.push("/chat");
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      {page === "login" ? (
        <LoginPage handleClick={handleClick} />
      ) : (
        <RegisterPage handleClick={handleClick} />
      )}
    </Container>
  );
};

export default HomePage;
