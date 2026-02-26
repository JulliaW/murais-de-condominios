export interface CondominioConfig {
    nome: string
    slug: string
    cores: {
        primary: string
        secondary: string
        accent: string
        background: string
        surface: string
        text: string
        textLight: string
    }
    endereco: {
        rua: string
        numero: string
        bairro: string
        cidade: string
        estado: string
        cep: string
    }
    planilhas: {
        avisos: string
        eventos: string
        faq: string
    }
    contato?: {
        email: string
        telefone: string
        whatsapp?: string
    }
}

const config: CondominioConfig = {
    nome: 'Village Novus',
    slug: 'village-novus',
    cores: {
        primary: '#4a5d23',      // Verde oliva escuro
        secondary: '#6b7f4e',    // Verde oliva médio
        accent: '#8fa06d',       // Verde oliva claro
        background: '#f8f7f4',   // Bege claro
        surface: '#ffffff',      // Branco
        text: '#2c3e2c',         // Verde escuro para texto
        textLight: '#5a6358',    // Verde acinzentado
    },
    endereco: {
        rua: 'Avenida das Palmeiras',
        numero: '1234',
        bairro: 'Jardim Europa',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01450-000',
    },
    planilhas: {
        avisos: 'https://opensheet.elk.sh/1-bdsoR-RZs52H0Js0oOM2D-QnuFjl6AEHbvVnVH-vOg/Avisos',
        eventos: 'https://opensheet.elk.sh/1-bdsoR-RZs52H0Js0oOM2D-QnuFjl6AEHbvVnVH-vOg/Eventos',
        faq: 'https://opensheet.elk.sh/1-bdsoR-RZs52H0Js0oOM2D-QnuFjl6AEHbvVnVH-vOg/FAQ',
    },
    contato: {
        email: 'contato@villagenovus.com.br',
        telefone: '(11) 3456-7890',
        whatsapp: '(11) 98765-4321',
    },
}

export default config
