import { prisma, type analysis } from '../clients'

export async function findAnalysis(session_id: number): Promise<analysis | null> {
    const analysis = await prisma.analysis.findFirst({ where: { session_id } })

    return analysis
}