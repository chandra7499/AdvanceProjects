/* eslint-disable no-undef */
/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Login } from "./components/AppContent/authentication/login";
import { myContext } from "./components/GlobalStates/contextHooks";

// ---- Mock hooks ----
vi.mock("./hooks/useAuth", () => {
  return {
    useSignUp: vi.fn(),
    useLogin: vi.fn(),
    useForgetPassword: vi.fn(),
    useGoogleLogin: vi.fn(),
    useFb: vi.fn(),
    useGitHub: vi.fn(),
  };
});

import {
  useSignUp,
  useLogin,
  useForgetPassword,
  useGoogleLogin,
  useFb,
  useGitHub,
} from "./hooks/useAuth";

// ✅ Helper: wrap in context provider
const renderWithContext = (ui, ctxValue = {}) => {
  const defaultValue = {
    AuthError: null,
    userLogin: false,
    loginPopUp: { current: { close: vi.fn() } },
  };
  return render(
    <myContext.Provider value={{ ...defaultValue, ...ctxValue }}>
      {ui}
    </myContext.Provider>
  );
};

describe("Login component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSignUp.mockReturnValue({ mutate: vi.fn(), isPending: false, isSuccess: false });
    useLogin.mockReturnValue({ mutate: vi.fn(), isPending: false });
    useForgetPassword.mockReturnValue({ mutate: vi.fn(), isPending: false });
    useGoogleLogin.mockReturnValue({ mutate: vi.fn() });
    useFb.mockReturnValue({ mutate: vi.fn() });
    useGitHub.mockReturnValue({ mutate: vi.fn() });
  });

  test("renders login form with email and password fields", () => {
    renderWithContext(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId("btn", { name: /^Login$/i })).toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  test("toggles password visibility when the eye icon is clicked", async() => {
    renderWithContext(<Login />);
    const passwordInput = screen.getByTestId(/pass-word/i);
    const toggleButton = screen.getByTestId("VisibilityOnIcon");
    expect(passwordInput).toHaveAttribute("type","password");

    fireEvent.click(toggleButton);
    await waitFor(() => {
        expect(passwordInput).toHaveAttribute("type", "text");
    });
    const toggleOffBtn = screen.getByTestId("VisibilityOffIcon");

    fireEvent.click(toggleOffBtn);
    await waitFor(() =>{
        expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  test("submits login form and calls useLogin", async () => {
    const mockLogin = vi.fn();
    useLogin.mockReturnValue({ mutate: mockLogin, isPending: false });

    renderWithContext(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByTestId("btn", { name: /^Login$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "secret",
      });
    });
  });

  test("switches to sign-up mode and calls useSignUp", async () => {
    const mockSignUp = vi.fn();
    useSignUp.mockReturnValue({ mutate: mockSignUp, isPending: false, isSuccess: false });

    renderWithContext(<Login />);
    fireEvent.click(screen.getByText(/sign-up/i));

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "signup@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "signup123" },
    });
    fireEvent.click(screen.getByTestId("btn", { name: /^signUp$/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "signup@example.com",
        password: "signup123",
        role: "user",
      });
    });
  });

  test("switches to forget-password mode and calls useForgetPassword", async () => {
    const mockForget = vi.fn();
    useForgetPassword.mockReturnValue({ mutate: mockForget, isPending: false });

    renderWithContext(<Login />);
    fireEvent.click(screen.getByText(/forget-password/i));

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "forgot@example.com" },
    });
    fireEvent.click(screen.getByTestId("btn", { name: /send link/i }));

    await waitFor(() => {
      expect(mockForget).toHaveBeenCalledWith({ email: "forgot@example.com" });
    });
  });

  test("calls social login hooks when icons clicked", () => {
    const g = vi.fn();
    const f = vi.fn();
    const gh = vi.fn();
    useGoogleLogin.mockReturnValue({ mutate: g });
    useFb.mockReturnValue({ mutate: f });
    useGitHub.mockReturnValue({ mutate: gh });

    renderWithContext(<Login />);
    fireEvent.click(screen.getByTestId("GoogleIcon"));
    fireEvent.click(screen.getByTestId("FacebookIcon"));
    fireEvent.click(screen.getByTestId("GitHubIcon"));

    expect(g).toHaveBeenCalled();
    expect(f).toHaveBeenCalled();
    expect(gh).toHaveBeenCalled();
  });

  test("renders loading state if isLoging is true", () => {
    useLogin.mockReturnValue({ mutate: vi.fn(), isPending: true });
    renderWithContext(<Login />);
    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
  });
});
