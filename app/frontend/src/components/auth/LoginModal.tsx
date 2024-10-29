"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import closeBtn from "@/assets/images/close_btn.png";
import googleLoginBtn from "@/assets/images/google_login.png";
import kakaoLoginBtn from "@/assets/images/kakao_login.png";
import naverLoginBtn from "@/assets/images/naver_login.png";
import React from "react";

// test
import { useSetAtom, useAtom } from "jotai";
import { accessTokenAtom, errorAtom, isLoadingAtom, userAtom } from "@/lib/atom";
import { useRouter } from "next/navigation";

type LoginModalPropsType = {
  isOpen: boolean;
  onClick: () => void;
};

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function LoginModal({ isOpen, onClick }: LoginModalPropsType) {
  const [isCloseAnimating, setIsCloseAnimating] = useState(false);

  // 닫기버튼 클릭 이벤트 핸들러
  const onClickCloseHandler = () => {
    // 닫기 애니메이션 시작
    setIsCloseAnimating(true);
    setTimeout(() => {
      // 3초 뒤, 모달창 상태 false
      onClick();
      // 3초 뒤, 애니메이션 false
      setIsCloseAnimating(false);
    }, 300);
  };

  // test

  const { user, isLoading, error, logout, fetchUserInfo, checkAuthStatus, refreshAccessToken, handleSocialLogin } = useAuth();
  const router = useRouter();

  const kakaoAuth = async () => {
    console.log("kakaoAuth");
    await handleSocialLogin("kakao");
  };

  const naverAuth = async () => {
    console.log("naverAuth");
    await handleSocialLogin("naver");
  };

  const googleAuth = async () => {
    console.log("googleAuth");
    await handleSocialLogin("google");
  };

  useEffect(() => {
    const verifyAuth = async () => {
      await fetchUserInfo();
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleRefreshToken = async () => {
    try {
      await refreshAccessToken();
      await checkAuthStatus();
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  // if (!user) return null;

  // test

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
            <div
              className={`w-[375px] h-[376px] fixed bottom-0 bg-white rounded-t-[20px] p-[30px] transition-transform duration-300 ease-in-out ${
                isCloseAnimating ? "animate-slide-bottom" : "animate-slide-top"
              }`}
              style={{
                animation: isCloseAnimating ? "slide-bottom 0.3s forwards" : "slide-top 0.3s forwards",
              }}
            >
              <div className="flex justify-end" onClick={onClickCloseHandler}>
                <Image src={closeBtn} alt="close-button" width={20} />
              </div>
              <div className="flex flex-col justify-center items-center mt-[24px]">
                <p className="text-[20px] font-medium">3초만에 로그인하고</p>
                <p className="text-[20px] font-medium">너나들이를 이용해보세요!</p>
                {/* <button onClick={handleRefreshToken} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                  토큰 갱신
                </button> */}
                <button onClick={googleAuth} className="btn relative flex w-full items-center justify-center h-[55px] mt-[24px] bg-[#F5F5F5] rounded-[8px] px-4">
                  <span className="absolute left-4">
                    <Image className="mr-3" src={googleLoginBtn} alt="google-login" width={38} height={38} />
                  </span>
                  <span className="text-[16px] font-medium">구글 로그인</span>
                </button>
                <p className="pt-[24px] pb-[16px] text-[#808080] text-[14px] cursor-pointer">다른 방법으로 로그인 하기</p>
                <div className="flex w-[130px] justify-between">
                  <button className="hover:bg-gray-200 rounded-[50%]" onClick={kakaoAuth}>
                    <Image src={kakaoLoginBtn} alt="kakao-button" width={50} height={50} className="btn" />
                  </button>
                  <button className="hover:bg-gray-200 rounded-[50%]" onClick={naverAuth}>
                    <Image src={naverLoginBtn} alt="naver-button" width={50} height={50} className="btn" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/token/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        return data.access_token;
      } else if (response.status === 401) {
        setUser(null);
        setAccessToken(null);
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }
      throw new Error("토큰 갱신에 실패했습니다.");
    } catch (error: any) {
      console.error("Failed to refresh token:", error);
      setError(error.message);
      throw error;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/auth/userInfo", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "사용자 정보를 가져오는데 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Failed to fetch user info:", error);
      setUser(null);
      localStorage.removeItem("user");
      setError(error.message);
    }
  };

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const response = await fetch(`${API_BASE_URL}/users/info`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setError("인증 상태 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login/${provider}`);
      const data = await response.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error("인증 URL이 제공되지 않았습니다.");
      }
    } catch (error) {
      console.error("로그인 초기화 중 오류 발생:", error);
    }
  };

  return { user, setUser, accessToken, setAccessToken, isLoading, error, setError, fetchUserInfo, refreshAccessToken, logout, checkAuthStatus, handleSocialLogin };
};
