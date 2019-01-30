export const ADD_PACKAGE = 'ADD_PACKAGE'
export const EDIT_PACKAGE = 'EDIT_PACKAGE'
export const REMOVE_PACKAGE = 'REMOVE_PACKAGE'

export function addPackage(pkg) {
  return {type: ADD_PACKAGE, pkg}
}

export function editPackage(pkg) {
  return {type: EDIT_PACKAGE, pkg}
}

export function removePackage(id) {
  return {type: REMOVE_PACKAGE, id}
}
