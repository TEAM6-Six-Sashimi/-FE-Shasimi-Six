export interface UserInfo {
  name: string;
  birthDate: string;
  phone: string;
  email: string;
}

export async function fetchUserInfo(): Promise<UserInfo> {
  // TODO: 실제 API 연결
  // const res = await fetch('http://localhost:8080/api/users/me', {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // return res.json();

  return {
    name: '홍길동',
    birthDate: '1990-01-01',
    phone: '010-1234-5678',
    email: 'hong@example.com',
  };
}