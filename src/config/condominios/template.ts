import type { CondominioConfig } from './village-novus'

/**
 * TEMPLATE PARA NOVO CONDOMÍNIO
 *
 * Para adicionar um novo condomínio:
 * 1. Copie este arquivo e renomeie com o slug do condomínio (ex: meu-condominio.ts)
 * 2. Preencha todas as informações abaixo
 * 3. Importe e registre em src/config/condominios/index.ts
 */

const config: CondominioConfig = {
    // Nome completo do condomínio
    nome: 'Nome do Condomínio',

    // Slug usado na URL (ex: /meu-condominio)
    // Use apenas letras minúsculas, números e hífens
    slug: 'nome-do-condominio',

    // Cores do condomínio
    cores: {
        primary: '#1976d2', // Cor principal (header, botões principais)
        secondary: '#26a69a', // Cor secundária (destaques)
        accent: '#9c27b0', // Cor de destaque (badges, ícones)
        background: '#f5f5f5', // Cor de fundo da página
        surface: '#ffffff', // Cor dos cards e superfícies
        text: '#2c3e50', // Cor do texto principal
        textLight: '#718096', // Cor do texto secundário
    },

    // Endereço completo
    endereco: {
        rua: 'Nome da Rua',
        numero: '123',
        bairro: 'Nome do Bairro',
        cidade: 'Cidade',
        estado: 'UF',
        cep: '00000-000',
    },

    // URLs das planilhas Google Sheets usando opensheet.elk.sh
    // Formato: https://opensheet.elk.sh/{ID_DA_PLANILHA}/{NOME_DA_ABA}
    planilhas: {
        avisos: 'https://opensheet.elk.sh/ID_DA_PLANILHA/Avisos',
        eventos: 'https://opensheet.elk.sh/ID_DA_PLANILHA/Eventos',
        faq: 'https://opensheet.elk.sh/ID_DA_PLANILHA/FAQ',
    },

    // Informações de contato (opcional)
    contato: {
        email: 'contato@condominio.com.br',
        telefone: '(00) 0000-0000',
        whatsapp: '(00) 00000-0000',
    },
}

export default config
