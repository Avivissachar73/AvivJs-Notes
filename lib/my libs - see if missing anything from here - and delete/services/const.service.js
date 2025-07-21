const userRoles = { // 'user', 'admin', 'producer'
  admin: 'admin',
  producer: 'producer',
  client: 'client',
  // developer: 'developer',
  
  // user: 'user',
}
const userRolesMap = {
  [userRoles.admin]: 1,
  [userRoles.producer]: 2,
  [userRoles.user]: 3,
  [userRoles.client]: 3
}

const organizationRoles = {
  creator: 'creator',
  admin: 'admin',
  producer: "producer",
  client: 'client', // TODO:: CHANGE TO watchOnly
}
const organizationRolesMap = {
  [organizationRoles.creator]: 1,
  [organizationRoles.admin]: 2,
  [organizationRoles.producer]: 3,
  [organizationRoles.client]: 4,
}

const organizationStatuses = {
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
  left: 'left'
}

const userGenders = {
  male: 'male',
  female: 'female',
  other: 'other',
  whatEver: 'whatEver'
}

const FILE_STORAGE_PATH = 'public/storage';
const TEMP_FILES_STORAGE_PATH = 'temp_files';


const BASE_APPS_STATIC_FILES_PATH = 'src/public/apps';


const exportItems = {
  userRoles,
  userRolesMap,
  organizationRoles,
  organizationRolesMap,
  organizationStatuses,
  userGenders,
  FILE_STORAGE_PATH,
  TEMP_FILES_STORAGE_PATH,
  BASE_APPS_STATIC_FILES_PATH
}


/* FOR NODE ENV:: */
module.exports = exportItems;

// /* FOR ES6 ENV:: */
// export default exportItems;

