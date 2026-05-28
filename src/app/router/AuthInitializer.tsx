import { useEffect, useRef } from "react";
import { useAuthStore } from "@/src/app/store/authStore";
import { authService } from "@/src/services/authService";

interface Props {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: Props) => {
  const hasChecked = useRef(false);

  const { isHydrated, accessToken, logout, setSessionChecked } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    // Tránh React StrictMode gọi 2 lần trong dev
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkSession = async () => {
      if (!accessToken) {
        console.log("🚫 [SESSION] No token / Không có token");
        useAuthStore.setState({
          isAuthenticated: false,
          isSessionChecked: true,
        });
        return;
      }

      try {
        console.log("🛡️ [SESSION] Checking Bearer / Kiểm tra Bearer");

        const response = await authService.me();

        console.log("✅ [SESSION] Bearer valid / Bearer hợp lệ");

        const currentUser = useAuthStore.getState().user;

        useAuthStore.setState({
          user: {
            ...currentUser,
            ...response.data,
            role: response.data.role ?? currentUser?.role,
          },
          isAuthenticated: true,
          isSessionChecked: true,
        });
      } catch (error) {
        console.log("❌ [SESSION] Bearer invalid / Bearer không hợp lệ");

        logout();

        setSessionChecked(true);
      }
    };

    checkSession();
  }, [isHydrated, accessToken, logout, setSessionChecked]);

  return <>{children}</>;
};
