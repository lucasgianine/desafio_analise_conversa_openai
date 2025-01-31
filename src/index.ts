import { prisma, findAnalysis, generateAnalysis } from './libs'

; (async function verifyAnalysis () {
    const chooseSession = 16
    try {
        const analysisFound = await findAnalysis(chooseSession)

        if (!analysisFound) {
            console.log('Não há analise para essa sessão, criando uma nova...')

            const messages = await prisma.message.findMany({
                where: {
                    session_id: chooseSession
                },
                select: {
                    content: true,
                    created_at: true,
                    remote: true
                }
            })

            const analysis = await generateAnalysis(chooseSession, messages)

            await prisma.analysis.create({
                data: {
                    session_id: chooseSession,
                    satisfaction: analysis.satisfaction,
                    summary: analysis.summary,
                    improvement: analysis.improvement,
                    created_at: new Date()
                }
            })

            console.log(`Análise da sessão ${chooseSession} criada:`)
            console.log(
                `Satisfação: ${analysis.satisfaction}\n` +
                `Resumo: ${analysis.summary}\n` +
                `Melhoria: ${analysis.improvement}`
            )
        } else {
            console.log(`Análise da sessão ${chooseSession}:`)
            console.log(
                `Satisfação: ${analysisFound[0].satisfaction}\n` +
                `Resumo: ${analysisFound[0].summary}\n` +
                `Melhoria: ${analysisFound[0].improvement}`
            )
        }
    } catch (error) {
        console.error(`Ocorreu um erro ao verificar análises: ${error}`)
    }
})()
