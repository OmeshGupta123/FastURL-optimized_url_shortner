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