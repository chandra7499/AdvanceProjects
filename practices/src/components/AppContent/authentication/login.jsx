import { Form } from "../../layouts/layouts";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { myContext } from "../../GlobalStates/contextHooks";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useContext, useEffect } from "react";
import {
  useSignUp,
  useLogin,
  useForgetPassword,
  useGoogleLogin,
  useFb,
  useGitHub,
} from "../../../hooks/useAuth";
import { Loading } from "../../loading";

export const Login = () => {
  const {
    mutate: signUp,
    isPending: userSigning,
  } = useSignUp();
  const { mutate: login, isPending: isLoging } = useLogin();
  const { mutate: googleAuth } = useGoogleLogin();
  const { mutate: facebookAuth } = useFb();
  const { mutate: githubAuth } = useGitHub();
  const { mutate: forgetPassword, isPending: forgetPasswordLoading } =
    useForgetPassword();
  const { AuthError, userLogin, loginPopUp,setAuthError } = useContext(myContext);

  const [state, setState] = useState(false);
  const [loginStates, setLoginStates] = useState({
    login: true,
    sign: false,
    forgetPassword: false,
  });

  const close = function () {
    loginPopUp.current.close();
  };

  function handleState() {
    setState((prev) => !prev);
  }

  function handleUserLoginData(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    let form = Object.fromEntries(formData.entries());
    loginStates.login
      ? login({ email: form.email, password: form.password })
      : loginStates.sign
      ? signUp({ email: form.email, password: form.password, role: "user" })
      : forgetPassword({ email: form.email });
  }

  function loginHandlers(identifier, value) {
    setLoginStates((prev) => {
      const obj = {
        ...prev,
        [identifier]: value,
      };
      return obj;
    });
  }

  useEffect(() => {
    if (userLogin) {
      close();
    }
  });

  return (
    <>
      <dialog
        ref={(el) => {
          loginPopUp.current = el;
        }}
        className="w-screen  sm:w-[80vw] md:scale-[1.1] lg:w-[50vw] lg:scale-[1.05] xl:w-[30vw] 
        min-h-[300px] max-h-[90vh] backdrop:backdrop-blur-[6px] 
        scale-[1.07] transition-all  rounded-lg bg-transparent"
      >
        <div className="flex justify-center items-center w-full h-full ">
          {isLoging ? (
            <Loading testid="loading-component" />
          ) : forgetPasswordLoading ? (
            <Loading testid="loading-component" />
          ) : userSigning ? (
            <Loading testid="loading-component" />
          ) : (
            <Form
              className="bg-slate-800 w-full  sm:w-[90vw]    px-6 flex justify-center  items-center flex-col py-2 gap-5 *:mb-3 transition-all ease-in-out rounded-xl pt-10"
              onSubmit={handleUserLoginData}
              id="loginForm"
            >
              <CancelIcon
                sx={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  color: "white",
                  zIndex: "1",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={close}
              />
              <h1 className="text-slate-50 font-semibold text-center text-2xl tracking-wider">
                {loginStates.sign
                  ? "signUp"
                  : loginStates.forgetPassword
                  ? "Forget Password"
                  : "Login"}
                {/* {signUpSuccess && <p className="text-green-700">registration successfull</p>}  */}
                {AuthError?.text && (
                  (AuthError?.cat === "signup" &&
                  loginStates.sign) ? (
                    <p
                      className={`${
                        AuthError?.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {AuthError?.text}
                    </p>
                  ):(
                  <p
                    className={`${
                      AuthError.cat === "login" && loginStates.login && AuthError?.type === "error" ? "text-red-700" : AuthError.type !== "error" ? setAuthError({type:"",text:"",cat:""}) :  "hidden"
                    }`}
                  >{AuthError?.text}</p>
                ))}
              </h1>
              <div className="*:w-full flex flex-col gap-5 w-full *:px-2 *:placeholder:text-gray-400 *:rounded-md  *:outline-none">
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="py-1 text-lg "
                  autoComplete="off"
                  required
                />
                {!loginStates.forgetPassword && (
                  <span className="*:w-full *:py-1 *:outline-none bg-slate-50 flex items-center hover:cursor-pointer transistion-all ease-in-out">
                    <input
                      type={state ? "text" : "password"}
                      name="password"
                      data-testid="pass-word"
                      placeholder="password"
                      autoFocus
                      autoComplete="off"
                      className="text-lg"
                      required
                    />
                    {!state ? (
                      <VisibilityOffIcon
                        data-testid="VisibilityOnIcon"
                        onClick={handleState}
                      />
                    ) : (
                      <VisibilityIcon
                        data-testid="VisibilityOffIcon"
                        onClick={handleState}
                      />
                    )}
                  </span>
                )}
              </div>

              <div className=" flex flex-col-reverse sm:flex-row  w-full justify-between items-center text-slate-400">
                <span className="flex justify-between mt-4 sm:mt-0 items-center">
                  {!loginStates.sign ? (
                    <span
                      className="text-slate-400  hover:text-slate-300 transition-all cursor-pointer ease-in-out hover:underline text-sm font-normal mr-2 "
                      onClick={() => {
                        loginHandlers("sign", true);
                        loginHandlers("forgetPassword", false);
                        loginHandlers("login", false);
                      }}
                    >
                      sign-up
                    </span>
                  ) : (
                    <span
                      className="text-slate-400  hover:text-slate-300 transition-all cursor-pointer ease-in-out hover:underline text-sm font-normal mr-2 "
                      onClick={() => {
                        loginHandlers("login", true);
                        loginHandlers("sign", false);
                        loginHandlers("forgetPassword", false);
                      }}
                    >
                      login
                    </span>
                  )}

                  {!loginStates.forgetPassword ? (
                    <span
                      className="text-slate-400 hover:text-slate-300 transition-all ease-in-out hover:underline cursor-pointer text-sm font-normal mr-auto ml-2"
                      onClick={() => {
                        loginHandlers("forgetPassword", true);
                        loginHandlers("login", false);
                        loginHandlers("sign", false);
                      }}
                    >
                      forget-password
                    </span>
                  ) : (
                    <span
                      className="text-slate-400  hover:text-slate-300 transition-all cursor-pointer ease-in-out hover:underline text-sm font-normal mr-2 "
                      onClick={() => {
                        loginHandlers("login", true);
                        loginHandlers("sign", false);
                        loginHandlers("forgetPassword", false);
                      }}
                    >
                      login
                    </span>
                  )}
                </span>

                <button
                  type="submit"
                  data-testid="btn"
                  className="bg-slate-100 xs:w-full sm:w-auto  text-slate-800 py-1 px-2 rounded-md "
                >
                  {loginStates.sign
                    ? "signUp"
                    : loginStates.forgetPassword
                    ? "send link"
                    : "Login"}
                </button>
              </div>

              {/* {loginStates.sign && (
              <div className="role text-gray-400 w-full flex justify-between ">
                <label htmlFor="user">user</label>
                <input type="radio" name="role" value="user" required />|
                <label htmlFor="admin">admin</label>
                <input type="radio" name="role" value="admin" required />
              </div>
            )} */}

              {!loginStates.forgetPassword && (
                <p className="text-gray-500">OR | continue</p>
              )}
              {!loginStates.forgetPassword && (
                <div className="flex flex-row gap-10 xs:scale-[0.8] sm:scale-[0.9] w-full justify-center p-2 *:rounded-full *:cursor-pointer *:text-slate-50 ">
                  <GoogleIcon
                    data-testid="GoogleIcon"
                    onClick={() => googleAuth()}
                    sx={{
                      fontSize: "40px",
                      padding: "5px",
                      ":hover": {
                        backgroundColor: "white",
                        color: "black",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                  />
                  <FacebookIcon
                    data-testid="FacebookIcon"
                    onClick={() => facebookAuth()}
                    sx={{
                      fontSize: "40px",
                      padding: "5px",
                      ":hover": {
                        backgroundColor: "white",
                        color: "black",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                  />
                  <GitHubIcon
                    data-testid="GitHubIcon"
                    onClick={() => githubAuth()}
                    sx={{
                      fontSize: "40px",
                      padding: "5px",
                      ":hover": {
                        backgroundColor: "white",
                        color: "black",
                        transition: "all 0.3s ease-in-out",
                      },
                    }}
                  />
                </div>
              )}
            </Form>
          )}
        </div>
      </dialog>
    </>
  );
};
