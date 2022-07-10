import { ComponentInternalInstance, getCurrentInstance } from 'vue'

export default (composableName: string): ComponentInternalInstance => {
  const instance = getCurrentInstance()

  if (instance == null) {
    throw Error(`${composableName} must be called from an instance`)
  }

  return instance
}
