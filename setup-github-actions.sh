#!/bin/bash

# GitHub Actions 自动部署配置脚本
# 此脚本帮助你快速配置GitHub Actions所需的环境变量

set -e

echo "=========================================="
echo "  GitHub Actions 自动部署配置向导"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否安装了必要的工具
check_dependencies() {
    local missing_deps=()
    
    if ! command -v gh &> /dev/null; then
        missing_deps+=("gh (GitHub CLI)")
    fi
    
    if ! command -v vercel &> /dev/null; then
        missing_deps+=("vercel (Vercel CLI)")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${YELLOW}警告: 以下工具未安装:${NC}"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "安装方法:"
        echo "  npm install -g vercel"
        echo "  brew install gh  (macOS)"
        echo ""
        echo "你可以选择手动配置Secrets,或安装这些工具后重新运行此脚本"
        read -p "是否继续手动配置? (y/n): " continue_manual
        if [[ ! $continue_manual =~ ^[Yy]$ ]]; then
            exit 1
        fi
        return 1
    fi
    return 0
}

# 获取Vercel配置
get_vercel_config() {
    echo -e "${GREEN}步骤 1: 获取Vercel配置${NC}"
    echo ""
    
    if command -v vercel &> /dev/null; then
        echo "正在链接Vercel项目..."
        vercel link --yes || true
        
        if [ -f ".vercel/project.json" ]; then
            VERCEL_ORG_ID=$(cat .vercel/project.json | grep -o '"orgId": *"[^"]*"' | sed 's/"orgId": *"\([^"]*\)"/\1/')
            VERCEL_PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId": *"[^"]*"' | sed 's/"projectId": *"\([^"]*\)"/\1/')
            
            echo -e "${GREEN}✓${NC} Vercel配置已获取:"
            echo "  Organization ID: $VERCEL_ORG_ID"
            echo "  Project ID: $VERCEL_PROJECT_ID"
            echo ""
        else
            echo -e "${RED}✗${NC} 无法获取Vercel配置"
            read -p "请手动输入 VERCEL_ORG_ID: " VERCEL_ORG_ID
            read -p "请手动输入 VERCEL_PROJECT_ID: " VERCEL_PROJECT_ID
        fi
    else
        echo "Vercel CLI未安装,需要手动输入配置"
        read -p "请输入 VERCEL_ORG_ID: " VERCEL_ORG_ID
        read -p "请输入 VERCEL_PROJECT_ID: " VERCEL_PROJECT_ID
    fi
    
    read -sp "请输入 VERCEL_TOKEN: " VERCEL_TOKEN
    echo ""
    echo ""
}

# 获取Supabase配置
get_supabase_config() {
    echo -e "${GREEN}步骤 2: 获取Supabase配置${NC}"
    echo ""
    
    if [ -f ".env" ]; then
        echo "检测到 .env 文件,尝试读取配置..."
        VITE_SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d '=' -f2)
        VITE_SUPABASE_ANON_KEY=$(grep "VITE_SUPABASE_ANON_KEY" .env | cut -d '=' -f2)
        
        if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
            echo -e "${GREEN}✓${NC} 已从 .env 文件读取Supabase配置"
            echo "  Supabase URL: $VITE_SUPABASE_URL"
            echo ""
            read -p "是否使用这些配置? (y/n): " use_env
            if [[ ! $use_env =~ ^[Yy]$ ]]; then
                VITE_SUPABASE_URL=""
                VITE_SUPABASE_ANON_KEY=""
            fi
        fi
    fi
    
    if [ -z "$VITE_SUPABASE_URL" ]; then
        read -p "请输入 VITE_SUPABASE_URL: " VITE_SUPABASE_URL
    fi
    
    if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        read -sp "请输入 VITE_SUPABASE_ANON_KEY: " VITE_SUPABASE_ANON_KEY
        echo ""
    fi
    echo ""
}

# 配置GitHub Secrets
setup_github_secrets() {
    echo -e "${GREEN}步骤 3: 配置GitHub Secrets${NC}"
    echo ""
    
    if command -v gh &> /dev/null; then
        echo "使用GitHub CLI配置Secrets..."
        
        gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"
        gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID"
        gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID"
        gh secret set VITE_SUPABASE_URL --body "$VITE_SUPABASE_URL"
        gh secret set VITE_SUPABASE_ANON_KEY --body "$VITE_SUPABASE_ANON_KEY"
        
        echo -e "${GREEN}✓${NC} GitHub Secrets配置完成!"
        echo ""
    else
        echo "请手动在GitHub仓库中配置以下Secrets:"
        echo ""
        echo "访问: https://github.com/你的用户名/你的仓库/settings/secrets/actions"
        echo ""
        echo "需要配置的Secrets:"
        echo "  1. VERCEL_TOKEN"
        echo "  2. VERCEL_ORG_ID = $VERCEL_ORG_ID"
        echo "  3. VERCEL_PROJECT_ID = $VERCEL_PROJECT_ID"
        echo "  4. VITE_SUPABASE_URL = $VITE_SUPABASE_URL"
        echo "  5. VITE_SUPABASE_ANON_KEY = (已保存在剪贴板)"
        echo ""
    fi
}

# 验证配置
verify_setup() {
    echo -e "${GREEN}步骤 4: 验证配置${NC}"
    echo ""
    
    local all_good=true
    
    # 检查配置文件
    if [ ! -f ".github/workflows/deploy.yml" ]; then
        echo -e "${RED}✗${NC} 缺少 .github/workflows/deploy.yml"
        all_good=false
    else
        echo -e "${GREEN}✓${NC} GitHub Actions工作流配置存在"
    fi
    
    # 检查环境变量
    if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
        echo -e "${RED}✗${NC} Vercel配置不完整"
        all_good=false
    else
        echo -e "${GREEN}✓${NC} Vercel配置完整"
    fi
    
    if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}✗${NC} Supabase配置不完整"
        all_good=false
    else
        echo -e "${GREEN}✓${NC} Supabase配置完整"
    fi
    
    echo ""
    
    if [ "$all_good" = true ]; then
        echo -e "${GREEN}=========================================="
        echo "  ✓ 配置完成!"
        echo "==========================================${NC}"
        echo ""
        echo "下一步:"
        echo "  1. 提交配置文件:"
        echo "     git add .github/"
        echo "     git commit -m 'ci: 添加GitHub Actions自动部署'"
        echo ""
        echo "  2. 推送到GitHub:"
        echo "     git push origin main"
        echo ""
        echo "  3. 查看Actions运行状态:"
        echo "     访问 https://github.com/你的用户名/你的仓库/actions"
        echo ""
    else
        echo -e "${YELLOW}配置未完成,请检查上述错误${NC}"
    fi
}

# 显示帮助信息
show_help() {
    echo "使用方法: ./setup-github-actions.sh [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  --skip-check   跳过依赖检查"
    echo ""
    echo "此脚本会引导你配置GitHub Actions自动部署所需的所有环境变量"
    echo ""
}

# 主流程
main() {
    # 解析参数
    SKIP_CHECK=false
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --skip-check)
                SKIP_CHECK=true
                shift
                ;;
            *)
                echo "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 检查依赖
    if [ "$SKIP_CHECK" = false ]; then
        check_dependencies
    fi
    
    # 执行配置步骤
    get_vercel_config
    get_supabase_config
    setup_github_secrets
    verify_setup
}

# 运行主流程
main "$@"

