import requests
from concurrent.futures import ThreadPoolExecutor
import random
import string
import time

BASE_URL = "http://localhost:5000" 
NUM_USERS = 50 

def random_string(n=6):
    return ''.join(random.choices(string.ascii_lowercase, k=n))

def register_user(i):
    url = f"{BASE_URL}/api/auth/register"
    data = {
        "username": f"testuser{i}",
        "email": f"testuser{i}@mail.com",
        "password": "Test1234!",
        "role": "customer"
    }
    try:
        r = requests.post(url, json=data, timeout=7)
        print(f"[Kayıt {i}] Durum: {r.status_code}")
        return r.status_code == 201 or r.status_code == 200
    except Exception as e:
        print(f"[Kayıt {i}] Hata: {e}")
        return False

def login_user(i):
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "username": f"testuser{i}",
        "password": "Test1234!"
    }
    try:
        r = requests.post(url, json=data, timeout=7)
        if r.status_code == 200:
            token = r.json().get("token")
            print(f"[Giriş {i}] Başarılı, Token uzunluğu: {len(token)}")
            return token
        else:
            print(f"[Giriş {i}] Başarısız, durum kodu: {r.status_code}")
            return None
    except Exception as e:
        print(f"[Giriş {i}] Hata: {e}")
        return None

def request_password_reset(email, new_password, i):
    url = f"{BASE_URL}/reset-password"
    data = {
        "email": email,
        "newPassword": new_password
    }
    try:
        r = requests.post(url, json=data, timeout=7)
        print(f"[Şifre Sıfırlama Talebi {i}] Durum: {r.status_code}")
        return r.status_code == 200 or r.status_code == 201
    except Exception as e:
        print(f"[Şifre Sıfırlama Talebi {i}] Hata: {e}")
        return False

def test_user_flow(i):
    if not register_user(i):
        print(f"[Kullanıcı {i}] Kayıt başarısız veya zaten var")

    token = login_user(i)
    if not token:
        print(f"[Kullanıcı {i}] Giriş başarısız, akış durduruluyor")
        return

    new_password = "YeniSifre123!"
    request_password_reset(f"testuser{i}@mail.com", new_password, i)

def main():
    print("Tam kapsamlı test başlatılıyor...")

    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = [executor.submit(test_user_flow, i) for i in range(1, NUM_USERS + 1)]

    print("Test tamamlandı.")

if __name__ == "__main__":
    main()
