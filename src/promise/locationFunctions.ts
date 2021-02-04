export const nestWithMetaId = (state, action, internal) => {
  return {
    ...state,
    [action.meta.id]: {
      ...state[action.meta.id],
      ...internal
    }
  }
}