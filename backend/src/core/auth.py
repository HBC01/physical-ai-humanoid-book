from typing import Optional
from pydantic import BaseModel

class UserProfile(BaseModel):
    id: str
    email: str
    hardware_tier: Optional[str] = "General/PC"
    software_env: Optional[str] = "Ubuntu 22.04"

# Placeholder for BetterAuth initialization logic
# In a real scenario, this would integrate with a BetterAuth client or library
def get_auth_config():
    return {
        "database": "postgres",
        "personalization": True
    }
