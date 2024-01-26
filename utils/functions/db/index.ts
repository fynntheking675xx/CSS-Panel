import Servers from './Servers'
import Bans from './Bans'
import Mutes from './Mutes'
import Settings from './Custom/Settings'
import Admins from './Admins'
import Logs from './Custom/Logs'

const query = {
	servers: Servers,
	admins: Admins,
	bans: Bans,
	mutes: Mutes,
	settings: Settings,
	logs: Logs,
}

export default query
