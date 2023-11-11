source './env.sh'

clear

echo '$ bun run start'
bun upgrade --canary

bun run start