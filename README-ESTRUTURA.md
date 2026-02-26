# 🏢 Village Novus - Portal do Morador

Plataforma de comunicação para condomínios, inspirada no design do Village Novus. Construída com Quasar Framework (Vue 3 + Vite + Pinia).

## 🎨 Design

O design segue uma identidade visual clean e elegante:

- **Cores**: Tons de verde oliva (#4a5d23, #6b7f4e, #8fa06d)
- **Fundo**: Bege claro (#f8f7f4)
- **Tipografia**: Playfair Display (títulos) + Inter (corpo)
- **Cards**: Bordas arredondadas, sombras suaves, bordas sutis

## 📊 Integração com Google Sheets

Os dados são carregados diretamente de uma planilha Google Sheets via **opensheet.elk.sh**.

### Planilha Configurada

**ID:** `1-bdsoR-RZs52H0Js0oOM2D-QnuFjl6AEHbvVnVH-vOg`

**Abas necessárias:**

#### 1. Avisos

| Coluna    | Descrição                             |
| --------- | ------------------------------------- |
| id        | Identificador único                   |
| titulo    | Título do aviso                       |
| conteudo  | Texto completo do aviso               |
| data      | Data do aviso (formato: DD/MM/YYYY)   |
| categoria | Categoria (ex: Manutenção, Segurança) |
| fixado    | "Sim" ou "Não" - destaca o aviso      |
| autor     | Quem publicou                         |

#### 2. Eventos

| Coluna    | Descrição                  |
| --------- | -------------------------- |
| id        | Identificador único        |
| titulo    | Nome do evento             |
| descricao | Descrição completa         |
| data      | Data do evento             |
| horario   | Horário (ex: "14h às 18h") |
| local     | Local do evento            |
| categoria | Tipo de evento             |

#### 3. FAQ

| Coluna    | Descrição           |
| --------- | ------------------- |
| id        | Identificador único |
| pergunta  | Texto da pergunta   |
| resposta  | Texto da resposta   |
| categoria | Categoria da dúvida |

### 🔒 Permissões da Planilha

Para funcionar, a planilha deve estar **publicamente acessível**:

1. Abra a planilha no Google Sheets
2. Clique em "Compartilhar"
3. Selecione "Qualquer pessoa com o link pode visualizar"
4. Copie o link e extraia o ID

## 🚀 Como Usar

### Desenvolvimento

```bash
quasar dev
```

Acesse: `http://localhost:9000/village-novus`

### Build para Produção

```bash
quasar build
```

## 📁 Estrutura do Projeto

```
src/
├── config/condominios/
│   ├── village-novus.ts    # Configuração do condomínio
│   ├── template.ts         # Template para novos condomínios
│   └── index.ts            # Registro de condomínios
├── pages/
│   ├── HomePage.vue        # Dashboard com hero section
│   ├── AvisosPage.vue      # Mural de avisos
│   ├── EventosPage.vue     # Calendário de eventos
│   └── FAQPage.vue         # Perguntas frequentes
├── layouts/
│   └── LayoutBase.vue      # Layout com navegação horizontal
├── services/
│   └── sheetsService.ts    # Consumo da planilha Google
└── stores/
    └── condominioStore.js  # Estado global
```

## 🎨 Personalização

### Cores

Edite `src/config/condominios/village-novus.ts`:

```typescript
cores: {
    primary: '#4a5d23',      // Verde oliva escuro
    secondary: '#6b7f4e',    // Verde oliva médio
    accent: '#8fa06d',       // Verde oliva claro
    background: '#f8f7f4',   // Fundo bege
    surface: '#ffffff',      // Cards
    text: '#2c3e2c',         // Texto principal
    textLight: '#5a6358',    // Texto secundário
}
```

### Planilha

Para usar outra planilha, atualize as URLs em `village-novus.ts`:

```typescript
planilhas: {
    avisos: 'https://opensheet.elk.sh/ID_PLANILHA/Avisos',
    eventos: 'https://opensheet.elk.sh/ID_PLANILHA/Eventos',
    faq: 'https://opensheet.elk.sh/ID_PLANILHA/FAQ',
}
```

## 📝 Funcionalidades

✅ **Home**: Hero section + cards de avisos e eventos recentes  
✅ **Avisos**: Grid de cards com badge "Fixado" para destaques  
✅ **Eventos**: Cards com data, horário e local  
✅ **FAQ**: Accordion expansível com perguntas e respostas  
✅ **Responsivo**: Layout adaptável para mobile e desktop  
✅ **Integração**: Dados em tempo real da planilha Google

## ⚠️ Notas Importantes

1. **A planilha deve ser pública** - O serviço opensheet não requer autenticação, mas precisa de acesso público
2. **Não armazene dados sensíveis** na planilha pública
3. **As colunas devem ter os nomes exatos** (ou variações comuns listadas no código)
4. **Datas**: Use formato brasileiro (DD/MM/YYYY) ou ISO (YYYY-MM-DD)

## 🔧 Tecnologias

- [Quasar Framework](https://quasar.dev/) - UI Framework
- [Vue 3](https://vuejs.org/) - Framework JS
- [Pinia](https://pinia.vuejs.org/) - State Management
- [opensheet.elk.sh](https://opensheet.elk.sh/) - Google Sheets API

---

**Desenvolvido com ❤️ para o Village Novus**
