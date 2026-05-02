import pytest


class TestGroupManagement:
    
    @pytest.mark.integration
    async def test_get_user_groups_list(self, client, authenticated_client, test_user, test_group):
        response = await authenticated_client.get("/groups/")
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
    
    @pytest.mark.integration
    async def test_get_user_groups_pagination(self, client, authenticated_client, test_user, test_db):
        from app.models import Group
        from app.core.utils import generate_uuid
        from datetime import datetime, timezone
        
        async with test_db() as session:
            for i in range(15):
                group = Group(
                    id=generate_uuid(),
                    filename=f"file{i}.pdf",
                    file_path=f"/uploads/file{i}.pdf",
                    user_id=test_user.id,
                    score=50 + i,
                )
                session.add(group)
            await session.commit()
        
        response = await authenticated_client.get("/groups/?page=1&limit=10")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["items"]) == 10
        assert data["page"] == 1
        assert data["total"] == 15
    
    
    @pytest.mark.integration
    async def test_delete_group(self, client, authenticated_client, test_group):
        response = await authenticated_client.delete(f"/groups/{test_group.id}")
        
        assert response.status_code == 200
        
        response = await authenticated_client.get(f"/groups/{test_group.id}")
        assert response.status_code == 404
    
    @pytest.mark.integration
    async def test_cannot_access_other_user_group(self, client, authenticated_client, test_user, test_group, test_db):
        from app.models import User
        from app.core.utils import generate_uuid
        from app.core.security import hash_password
        from app.services.auth_service import AuthService
        
        async with test_db() as session:
            other_user = User(
                id=generate_uuid(),
                email="otheruser@example.com",
                password=hash_password("OtherPassword123!"),
                full_name="Other User",
                role="user"
            )
            session.add(other_user)
            await session.commit()
        
        access_token = AuthService.create_access_token({"sub": "otheruser@example.com"})
        client.cookies.set("access_token", access_token)
        
        response = await client.get(f"/groups/{test_group.id}")
        
        assert response.status_code in [404, 403]


class TestGroupFiltering:
    
    @pytest.mark.integration
    async def test_filter_groups_by_search(self, client, authenticated_client, test_user, test_db):
        from app.models import Group
        from app.core.utils import generate_uuid
        
        async with test_db() as session:
            group1 = Group(
                id=generate_uuid(),
                filename="python-tutorial.pdf",
                file_path="/uploads/python-tutorial.pdf",
                user_id=test_user.id,
            )
            group2 = Group(
                id=generate_uuid(),
                filename="javascript-guide.pdf",
                file_path="/uploads/javascript-guide.pdf",
                user_id=test_user.id,
            )
            session.add_all([group1, group2])
            await session.commit()
        
        response = await authenticated_client.get("/groups/?search=python")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert "python" in data["items"][0]["filename"].lower()
    
    @pytest.mark.integration
    async def test_sort_groups_by_score(self, client, authenticated_client, test_user, test_db):
        from app.models import Group
        from app.core.utils import generate_uuid
        
        async with test_db() as session:
            scores = [50, 75, 90, 60]
            for score in scores:
                group = Group(
                    id=generate_uuid(),
                    filename=f"file_{score}.pdf",
                    file_path=f"/uploads/file_{score}.pdf",
                    user_id=test_user.id,
                    score=score,
                )
                session.add(group)
            await session.commit()
        
        response = await authenticated_client.get("/groups/?sort_by=score&sort_order=asc")
        
        assert response.status_code == 200
        data = response.json()
        scores = [item["score"] for item in data["items"] if item["score"]]
        assert scores == sorted(scores)


# python -m pytest tests/integration/test_group_endpoints.py -v

