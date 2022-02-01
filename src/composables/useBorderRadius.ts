import { BorderRadius } from '@/types'
import useInstance from './useInstance'

const mappedBorderRadius: Record<BorderRadius, string> = {
  none: '0em',
  sm: '0.185em',
  default: '0.375em',
  md: '0.75em',
  lg: '3em',
  full: '50%',
}

export default () => {
  const { props } = useInstance('useBorderRadius')

  if (!props.rounded) {
    return '0em'
  }

  return mappedBorderRadius[props.rounded as keyof typeof mappedBorderRadius]
}
