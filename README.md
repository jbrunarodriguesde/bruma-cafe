# Bruma Café

Cafeteria fictícia de cafés especiais: apresentação editorial e pedidos para retirada, com pagamento no balcão. Produtos, eventos e localização são ilustrativos. Não há cobrança online nem envio de mensagens a terceiros.

## Executar localmente

Requisitos: Node.js 22 ou superior, npm e Docker Compose, ou uma instância PostgreSQL acessível.

```powershell
Copy-Item .env.example .env
npm install
docker compose up -d
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

Abra http://localhost:3000. Se a porta estiver ocupada, use a URL informada pelo servidor. O banco usa volume persistente `bruma_pgdata`. As credenciais do Compose são exclusivamente locais; substitua-as em qualquer ambiente compartilhado. Nunca publique `.env`.

Para produção, configure PostgreSQL, URL da aplicação e segredos exigidos pelo servidor, aplique migrações e execute `npm run build` seguido de `npm start`. Cookies seguros exigem HTTPS em produção. Não substitua PostgreSQL por armazenamento no navegador para receber pedidos.

## Arquitetura e dados

Next.js App Router com TypeScript apresenta páginas e APIs no mesmo projeto. Prisma acessa PostgreSQL e Zod valida entradas no servidor. Valores monetários usam centavos inteiros.

- `StaffUser`: identidade, senha derivada e papel da equipe.
- `Category`, `MenuItem`, `ModifierGroup`, `ModifierOption`: catálogo, disponibilidade, ingredientes, alergênicos, tamanhos e adicionais.
- `Order`, `OrderItem`: pedido e descrição/preço preservados no momento da compra.
- `PickupSlot`, `OpeningHours`: capacidade, reservas e expediente.
- `Event`, `ContactMessage`: agenda ilustrativa e contatos persistidos.

O cliente envia identificadores e quantidades; o servidor consulta os preços vigentes. A reserva de capacidade e a criação do pedido devem ocorrer na mesma transação. O acompanhamento exige identificador e token privado; o banco armazena o hash do token. Trate o link de acompanhamento como informação privada.

Fluxo permitido: recebido → aceito → em preparo → pronto → retirado. Cancelamento permitido a partir de recebido, aceito e em preparo. Retirado e cancelado são terminais. A aplicação considera `America/Sao_Paulo`, antecedência mínima de 20 minutos e limites do expediente.

## Permissões

Visitantes consultam o catálogo e a agenda, criam pedidos e mensagens e acompanham apenas pedidos cujo token possuem. A equipe autenticada opera pedidos; operações administrativas exigem autorização no servidor. O seed cria dados demonstrativos: confira as credenciais e papéis diretamente em `prisma/seed.ts` antes de executar. Nunca reutilize uma senha de demonstração em produção.

## Validação

```powershell
npm test
npm run build
```

A suíte de regras deve cobrir indisponibilidade, cálculo de valores, opções inválidas, antecedência e transições. O teste concorrente com banco precisa de `DATABASE_URL` apontando para PostgreSQL preparado: não confunda um teste unitário de capacidade com uma corrida real de transações. Testes de interface exigem servidor em execução e navegador Playwright instalado quando configurados.

Resultados efetivamente executados e limitações do ambiente são informados na entrega; esta seção não declara aprovação de verificações ainda não executadas. Sem banco configurado, uma página pública renderizada não comprova pedidos persistidos. A publicação requer ambiente de execução compatível com Next.js e conexão PostgreSQL.

## Estudo de caso para portfólio

**Problema:** tornar a compra de cafés com tamanhos e adicionais simples no celular, sem prometer horários que a cozinha não consegue atender.

**Solução:** catálogo por categoria, seleção de opções, carrinho e retirada com acompanhamento privado. A identidade mistura creme, verde-musgo e laranja queimado, títulos editoriais e fotografia gastronômica.

**Decisões:** total recalculado no servidor, snapshots dos itens para preservar histórico, reserva transacional de faixa e máquina de estados explícita. Pagamento na retirada evita representar uma integração financeira inexistente.

**Demonstração:** preparar o banco e seed, selecionar um produto e adicionais, reservar uma faixa e abrir o acompanhamento; entrar no painel da equipe e avançar o pedido. Não são apresentados clientes, depoimentos ou resultados comerciais reais.

## Design e recursos

Veja [referências e limitações de consulta](docs/design-references.md). A identidade da Bruma é original. Fotografias são recursos de demonstração; confira URLs e condições de uso antes de redistribuir. Versões exatas das dependências ficam registradas no arquivo de lock.

## Verificação realizada em 04/11/2026
- Build Next.js de produção: aprovado, incluindo TypeScript.
- Vitest: 4 testes aprovados; 1 teste de concorrência PostgreSQL ignorado por falta de TEST_DATABASE_URL.
- Auditoria npm: zero vulnerabilidades após override deepmerge-ts 8.
- Prisma: schema validado e cliente gerado.
- Não há Docker/PostgreSQL neste ambiente: migração e seed não foram executados contra banco real, e a aplicação não foi publicada.
- Verificação visual em navegador e fluxos Playwright em celular/tablet/desktop ainda pendentes.
- Implementação usa CSS próprio com tokens; Tailwind, GSAP e Open Graph ainda não implementados. Administração atual edita preço/disponibilidade, expediente e eventos; edição completa de categorias, ingredientes e opções ainda pendente.
- Fontes são carregadas do Google Fonts; imagens ilustrativas usam Unsplash remoto.

## Demonstração sem banco
Para explorar a interface sem PostgreSQL, defina DEMO_MODE=true no arquivo .env e execute npm install e npm run dev. O catálogo usa 18 produtos ilustrativos. Pedidos demonstrativos ficam apenas neste navegador, sem envio real. Painel da equipe requer o banco configurado.

