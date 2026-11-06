import pytest
from fastapi import status

class TestURLCreation:
    def test_create_short_url_success(self, client, auth_headers):
        response = client.post(
             "/urls",
             json={"original_url":"https://www.google.com"},
             headers=auth_headers)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "short_code" in data
        assert data["original_url"] == "https://www.google.com"
        assert len(data["short_code"]) == 6
        
    def test_get_short_url_success(self,client,auth_headers):
        client.post(
            "/urls",
            json= {"original_url":"https://www.youtube.com/watch?v=LJMiaCoPDEg"},
            headers=auth_headers
        )
        
        response = client.get(
            "/urls",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["original_url"] == "https://www.youtube.com/watch?v=LJMiaCoPDEg"

    def test_create_short_url_invalid_url(self, client, auth_headers):
        response = client.post(
            "/urls",
            json={"original_url": "invalid-url-without-scheme"},
            headers=auth_headers
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_redirect_url_success(self, client, auth_headers):
        create_res = client.post(
            "/urls",
            json={"original_url": "https://www.github.com"},
            headers=auth_headers
        )
        assert create_res.status_code == status.HTTP_201_CREATED
        short_code = create_res.json()["short_code"]

        redirect_res = client.get(f"/urls/r/{short_code}", follow_redirects=False)
        assert redirect_res.status_code == status.HTTP_307_TEMPORARY_REDIRECT
        assert redirect_res.headers["location"] == "https://www.github.com"

    def test_redirect_url_not_found(self, client):
        response = client.get("/urls/r/nonex1", follow_redirects=False)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"status": "healthy"}