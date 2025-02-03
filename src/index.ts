import { prisma, findAnalysis, generateAnalysis } from './libs'

; (async function verifyAnalysis () {
    try {
        const sessions = await prisma.session.findMany({ select: { id: true } })

        for (const session of sessions) {
            const sessionId = session.id
            const analysisFound = await findAnalysis(sessionId)

            if (!analysisFound) {
                console.log('Não há analise para essa sessão, criando uma nova...')

                const messages = await prisma.message.findMany({
                    where: {
                        session_id: sessionId
                    },
                    select: {
                        content: true,
                        created_at: true,
                        remote: true
                    }
                })

                const analysis = await generateAnalysis(sessionId, messages)

                await prisma.analysis.create({
                    data: {
                        session_id: sessionId,
                        satisfaction: analysis.satisfaction,
                        summary: analysis.summary,
                        improvement: analysis.improvement,
                        created_at: new Date()
                    }
                })

                console.log(`Análise da sessão ${sessionId} criada:`)
                console.log(
                    `Satisfação: ${analysis.satisfaction}\n` +
                    `Resumo: ${analysis.summary}\n` +
                    `Melhoria: ${analysis.improvement}`
                )
            } else {
                console.log(`Análise da sessão ${sessionId}:`)
                console.log(
                    `Satisfação: ${analysisFound.satisfaction}\n` +
                    `Resumo: ${analysisFound.summary}\n` +
                    `Melhoria: ${analysisFound.improvement}`
                )
            }
        }
    } catch (error) {
        console.error(`Ocorreu um erro ao verificar análises: ${error}`)
    }
})()
