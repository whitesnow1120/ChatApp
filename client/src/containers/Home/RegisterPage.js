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

import { register } from "../../apis/userApi";
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
  name: Yup.string().required().max(40, "Too Long!"),
  email: Yup.string().required().email().label("email"),
  password: Yup.string()
    .required()
    .min(5, "Password is too short - should be 5 letters minimum.")
    .label("Password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      "Must Contain One Uppercase, One Lowercase, One Number",
    ),
  password2: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords do not match",
  ),
});

const RegisterPage = ({ handleClick }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = () => {
    handleClick("login");
  };

  const handleSubmit = async (data) => {
    const response = await register(data);
    if (response.status !== 200) {
      enqueueSnackbar("Failed to Register", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } else {
      enqueueSnackbar("Successfully registered.", {
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
          Sign Up
        </TypoGraphy>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            password2: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                id="name"
                className={classes.textField}
                name="name"
                label="Name"
                fullWidth={true}
                variant="outlined"
                margin="normal"
                required={true}
                helperText={touched.name ? errors.name : ""}
                error={touched.name && Boolean(errors.name)}
                value={values.name}
                onChange={handleChange}
              />
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
              <TextField
                id="password2"
                className={classes.textField}
                name="password2"
                label="Confirm Password"
                fullWidth={true}
                variant="outlined"
                margin="normal"
                required={true}
                helperText={touched.password2 ? errors.password2 : ""}
                error={touched.password2 && Boolean(errors.password2)}
                value={values.password2}
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
                Register
              </Button>
            </form>
          )}
        </Formik>
      </Grid>
      <Grid item xs={9}>
        <TypoGraphy>
          <Link onClick={handleLogin}>
            Already have an account?
          </Link>
        </TypoGraphy>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
