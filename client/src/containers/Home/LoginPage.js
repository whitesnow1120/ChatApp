import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import TypoGraphy from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { login } from "../../apis/userApi";
import history from "../../utils/history";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string()
    .required()
    .min(5, "Password is too short - should be 5 letters minimum.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      "Must Contain One Uppercase, One Lowercase, One Number",
    ),
});

const LoginPage = ({ handleClick }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleRegister = () => {
    handleClick("register");
  };

  const handleSubmit = async (data) => {
    const response = await login(data);
    if (response.status !== 200) {
      enqueueSnackbar("Failed to Login", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } else {
      enqueueSnackbar("Successfully logged in.", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <TypoGraphy component="h1" variant="h5" align="center">
          Sign In
        </TypoGraphy>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                id="email"
                className={classes.textField}
                name="email"
                label="Email"
                fullWidth={true}
                variant="outlined"
                margin="normal"
                required={true}
                helperText={touched.email ? errors.email : ""}
                error={touched.email && Boolean(errors.email)}
                value={values.email}
                onChange={handleChange}
                type="email"
              />
              <TextField
                id="password"
                className={classes.textField}
                name="password"
                label="Password"
                fullWidth={true}
                variant="outlined"
                margin="normal"
                required={true}
                helperText={touched.password ? errors.password : ""}
                error={touched.password && Boolean(errors.password)}
                value={values.password}
                onChange={handleChange}
                type="password"
              />
              <Button
                type="submit"
                fullWidth={true}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Login
              </Button>
            </form>
          )}
        </Formik>
      </Grid>
      <Grid item xs={9}>
        <TypoGraphy>
          <Link onClick={handleRegister}>
            Don't have an account?
          </Link>
        </TypoGraphy>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
