import { prisma, type analysis } from '../clients'

export async function findAnalysis(session_id: number): Promise<analysis[]> {
    const analysis = await prisma.analysis.findMany({ where: { session_id } })

    return analysis
}