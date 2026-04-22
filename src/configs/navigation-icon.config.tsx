import {
    // PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'
import { Home, FolderKanban, Building2, Bot, Users, Shield, FileText, Calendar, User } from 'lucide-react'
import { TbCurrencyNaira, TbSettingsCode } from 'react-icons/tb'
import { LuKey } from 'react-icons/lu'
import { IoBusiness } from 'react-icons/io5'
import { GrChatOption } from 'react-icons/gr'
import { BsMicrosoftTeams } from 'react-icons/bs'
import { VscRobot, VscSettingsGear } from 'react-icons/vsc'
import { FaMoneyBills } from 'react-icons/fa6'
import { FaRegCreditCard } from 'react-icons/fa'
import { GiTakeMyMoney } from 'react-icons/gi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <Home />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    revenue: <TbCurrencyNaira />,
    key: <LuKey />,
    projects: <FolderKanban />,
    api_provider: <TbSettingsCode />,
    enterprise: <IoBusiness />,
    team: <Users />,
    usermanagement: <Users />,
    chat: <GrChatOption />,
    aiplayground: <VscRobot />,
    platformSettings: <VscSettingsGear />,
    bulkCredit: <FaMoneyBills />,
    sharedCredits: <FaRegCreditCard />,
    billing: <GiTakeMyMoney />,
    workspace: <Building2 />,
    copilotHub: < Bot />,
    shield: <Shield />,
    security: <Shield />,
    audit: <FileText />,
    calendar: <Calendar />,
    userProfile: <User />
}

export default navigationIcon
