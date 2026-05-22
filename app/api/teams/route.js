import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request) {
  const session = await auth()
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const teams = await prisma.team.findMany({
    where: { userId: session.user.id },
    include: { members: true },
    orderBy: { createdAt: "desc" },
  })

  return Response.json(teams)
}

export async function POST(request) {
  const session = await auth()
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await request.json()

  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    + "-" + Date.now()

  const team = await prisma.team.create({
    data: {
      name: body.name,
      slug,
      userId: session.user.id,
      members: {
        create: body.pokemon.map((p, index) => ({
          pokemonId: p.id,
          position: index,
        }))
      }
    },
    include: { members: true }
  })

  return Response.json(team)
}