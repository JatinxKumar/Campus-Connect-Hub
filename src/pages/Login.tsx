import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: "outline" | "filled_blue" | "filled_black";
              size: "large" | "medium" | "small";
              width?: string;
              text?: string;
            }
          ) => void;
        };
      };
    };
  }
}

const Login = () => {
  const { loginWithGoogle, loginWithCredentials, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname || "/admin";
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const handleDemoLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const isValid = await loginWithCredentials(email, password);

      if (!isValid) {
        toast({
          title: "Invalid demo credentials",
          description: "Use admin@campusconnect.demo and admin123.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login successful",
        description: "Signed in with demo credentials.",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unable to reach backend.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    if (!googleClientId) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          const authenticate = async () => {
            try {
              const isValid = await loginWithGoogle(response.credential || "");

              if (!isValid) {
                toast({
                  title: "Login failed",
                  description: "Unable to authenticate with Google.",
                  variant: "destructive",
                });
                return;
              }

              toast({
                title: "Login successful",
                description: "Signed in with Google.",
              });
              navigate(from, { replace: true });
            } catch (error) {
              toast({
                title: "Login failed",
                description: error instanceof Error ? error.message : "Unable to authenticate with Google.",
                variant: "destructive",
              });
            }
          };

          void authenticate();
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: "320",
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [from, googleClientId, isAuthenticated, loginWithGoogle, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isAuthenticated ? "Already Logged In" : "Admin Login"}</CardTitle>
            <CardDescription>
              {isAuthenticated
                ? "You are already authenticated."
                : "Continue with Google to access the admin dashboard."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="space-y-3">
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Signed in as {user.name}
                  </p>
                )}
                <Link to="/admin" className="block">
                  <Button className="w-full">Go to Admin Dashboard</Button>
                </Link>
                <Link to="/logout" className="block">
                  <Button variant="outline" className="w-full">Logout</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <form onSubmit={handleDemoLogin} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@campusconnect.demo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="admin123"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Login with Demo Credentials</Button>
                </form>

                <p className="text-xs text-muted-foreground text-center">
                  Demo credentials: <span className="font-medium">admin@campusconnect.demo</span> / <span className="font-medium">admin123</span>
                </p>

                <div className="flex justify-center">
                  <div ref={googleButtonRef} />
                </div>
                {!googleClientId && (
                  <p className="text-xs text-muted-foreground text-center">
                    Google Sign-In is optional. Add VITE_GOOGLE_CLIENT_ID to your .env file to enable it.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
