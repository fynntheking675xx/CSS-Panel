import type { NextApiRequest, NextApiResponse } from 'next'
import type { Flag } from '@/utils/types/db/css'
import query from '@/utils/functions/db'
import router from '@/lib/Router'
import adminSchema from '@/utils/schemas/adminSchema'
import isAdminMiddleware from '@/utils/middlewares/isAdminMiddleware'
import { SA_Admin } from '@/utils/types/db/plugin'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await router.run(req, res)

	const { method } = req

	const isAdmin = await isAdminMiddleware(req, res, ['@css/root'])
	if (!isAdmin) return

	const { id } = req.query as { id: string }
	const admin = await query.admins.getById(Number(id))
	if (!admin) return res.status(404).json({ message: 'Admin not found' })

	switch (method) {
		case 'PUT': {
			const { flags, immunity, player_name, player_steamid, server_id } = adminSchema.parse(req.body)

			const userImmunity = isAdmin.immunity
			if (Number(immunity) >= Number(userImmunity))
				return res.status(403).json({ message: 'You cannot edit an admin with higher immunity than yours' })

			const admin = await query.admins.update({
				id: Number(id),
				flags: flags as SA_Admin['flags'],
				immunity: immunity.toString() ?? 0,
				player_name,
				player_steamid,
				server_id: server_id ?? null,
			})

			// todo send a rcon command to update the admin on the servers

			return res.status(201).json(admin)
		}

		case 'DELETE': {
			try {
				const admin = await query.admins.getById(Number(id))
				if (!admin) return res.status(404).json({ message: 'Admin not found' })

				const userImmunity = isAdmin.immunity
				if (Number(admin.immunity) >= Number(userImmunity))
					return res
						.status(403)
						.json({ message: 'You cannot delete an admin with higher immunity than yours' })

				await query.admins.delete(Number(id))

				// todo send a rcon command to update the admin on the servers

				return res.status(201).send('Admin deleted')
			} catch (error) {
				return res.status(500).json({ message: 'Error while deleting admin', error })
			}
		}

		default: {
			return res.status(405).json({ message: 'Method not allowed' })
		}
	}
}

export default handler
