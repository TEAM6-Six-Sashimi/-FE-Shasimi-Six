// 회원 서비스(로그인/회원가입)
import { LoginRequest, LoginResponse } from "@/features/auth/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginService(payload: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "아이디 또는 비밀번호가 일치하지 않습니다.");
    }

    return response.json();
}