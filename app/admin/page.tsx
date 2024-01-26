'use client'

import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { IconPlus } from '@tabler/icons-react'
import AdminsTable from './settings/UI/Admins/Table'
import useManageAdminsStore from './settings/UI/Admins/store'
import AdminModal from './settings/UI/Admins/Modal'

const ManageAdmins = () => {
	const setOpen = useManageAdminsStore((state) => state.setOpen)

	return (
		<Card>
			<CardHeader className='text-2xl font-medium flex flex-row justify-between'>
				Manage Admins
				<Button
					size='sm'
					variant='flat'
					color='primary'
					onClick={() => setOpen(true)}
				>
					<IconPlus />
					Add new Admin
				</Button>
			</CardHeader>
			<CardBody>
				<AdminsTable />
			</CardBody>
			<AdminModal />
		</Card>
	)
}

export default ManageAdmins
