from app.main import app

print("\nAll registered routes:")
print("-" * 60)
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        methods = ', '.join(sorted(route.methods)) if route.methods else 'N/A'
        print(f"{route.path:40s} {methods}")
    elif hasattr(route, 'path'):
        print(f"{route.path:40s} (mount)")
print("-" * 60)
