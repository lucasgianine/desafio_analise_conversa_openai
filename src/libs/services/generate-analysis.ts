import { openai } from '../clients'

export type AnalysisResponse = {
    satisfaction: number
    summary: string
    improvement: string
}

export async function generateAnalysis (
    session_id: number,
    messages: any
): Promise<AnalysisResponse> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
            {
                role: 'developer',
                content: 'Você é um agente especializado em gerar análises de sessões ' +
                'de conversacionais sobre agendamento de horários em motéis. ' +
                `Por favor, analise a sessão ${session_id} e responda com um ` +
                'resumo e sugestões de melhoria. Lembre-se de que'
            },
            { role: 'user', content: `
                Baseado nas informações da conversa abaixo, por favor gere uma estrutura em JSON com:
                - summary: Resuma a conversa entre o usuário e o agente de IA com os pontos mais importantes
                - satisfaction: Parâmetro para satisfação é conforme se as respostas fazem sentido com a pergunta do usuário
                - improvement: Sugestão de melhoria para o atendimento

                ## Chain of thought
                1. Leia as mensagens da sessão e faça a análise baseado nas mensagens do usuário.
                2. Separe as informações mais relevantes para identificar o nível de satisfação do usuário.
                3. O campo satisfaction deve ser um número de 0 a 10 (Inteiros).
                4. O campo summary deve ser uma string com no máximo 500 caracteres.
                5. O campo improvement deve ser uma string com no máximo 500 caracteres.
                6. Não perca o contexto da conversa, e tente identificar o que o usuário deseja.
                7. Não invente informações, apenas analise o que foi dito.
                8. Leia sua resposta e compare a mesma com as mensagens do usuário para avaliar se a análise está correta.
                9. Separe as informações em um objeto JSON com os campos satisfaction, summary e improvement.
                10. O output deve ser SOMENTE o objeto, sem mensagens adicionais.

                ## Mensagens da sessão
                ${messages.map((message: any) => {
                    return `${message.remote ? 'Usuário' : 'Agente'}: ${message.content}`
                }).join('\n')}

                ## Exemplo de output
                {
                    "satisfaction": 10,
                    "summary": "O usuário está satisfeito com o atendimento e conseguiu agendar o horário desejado.",
                    "improvement": "O usuário poderia ter sido informado sobre a disponibilidade de quartos extras."
                }
                ` }
        ]
    })

    return JSON.parse(response.choices[0].message.content as string)
}