#!/bin/bash

# Blog Installation Verification Script

echo "🔍 Checking Blog Installation..."
echo ""

# Check if required directories exist
echo "📁 Checking directories..."
if [ -d "src/pages/Blog" ]; then
    echo "✅ src/pages/Blog exists"
else
    echo "❌ src/pages/Blog not found"
    exit 1
fi

if [ -d "src/services/Blog" ]; then
    echo "✅ src/services/Blog exists"
else
    echo "❌ src/services/Blog not found"
    exit 1
fi

# Check if key files exist
echo ""
echo "📄 Checking blog files..."

files=(
    "src/pages/Blog/index.tsx"
    "src/pages/Blog/post-detail.tsx"
    "src/pages/Blog/about.tsx"
    "src/pages/Blog/manage.tsx"
    "src/pages/Blog/tag-manage.tsx"
    "src/pages/Blog/typing.ts"
    "src/pages/Blog/components/PostCard.tsx"
    "src/pages/Blog/components/PostForm.tsx"
    "src/pages/Blog/components/MarkdownRenderer.tsx"
    "src/services/Blog/index.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file not found"
        exit 1
    fi
done

# Check routes
echo ""
echo "🛣️ Checking routes configuration..."
if grep -q "/blog" config/routes.ts; then
    echo "✅ Blog routes configured in config/routes.ts"
else
    echo "❌ Blog routes not found in config/routes.ts"
    exit 1
fi

# Check package.json for required deps
echo ""
echo "📦 Checking dependencies..."
if grep -q "\"antd\"" package.json; then
    echo "✅ Ant Design installed"
else
    echo "❌ Ant Design not found"
    exit 1
fi

if grep -q "\"react\"" package.json; then
    echo "✅ React installed"
else
    echo "❌ React not found"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Blog installation verified successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open http://localhost:8000/blog"
echo "3. Read documentation in src/pages/Blog/README.md"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Technical guide"
echo "  - GUIDE.md - User guide (Vietnamese)"
echo "  - DEVELOPER.md - Developer reference"
echo "  - BLOG_INSTALLATION.md - Installation info"
echo ""
