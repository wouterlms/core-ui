import {
  computed,
  h,
  useAttrs,
} from 'vue'

import { RouteLocationRaw, RouterLink } from 'vue-router'

import { usePropsWithDefaults } from '@/composables'

export interface Props {
  /**
   * Renders a `<RouterLink>`
   */
  to?: RouteLocationRaw

  /**
   * Renders a `<a>`
   */
  href?: string

  /**
   * Native button type, defaults to `button`
   */
  type?: string

  /**
   * Disable button
   */
  isDisabled?: boolean

  /**
   * Show loader and disable button
   */
  isLoading?: boolean
}

export const defaultProps = {
  type: 'button',
  isDisabled: false,
  isLoading: false,
  to: undefined,
  href: undefined,
}

export default () => {
  const props = usePropsWithDefaults(defaultProps, useAttrs() as Props)

  const component = computed<typeof RouterLink | string>(() => {
    if (props.value.to !== undefined) {
      return RouterLink
    }

    if (props.value.href !== undefined) {
      return 'a'
    }

    return 'button'
  })

  const Component = computed(() => {
    const {
      isLoading,
      isDisabled,
      type,
      to,
      href,
    } = props.value

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return h(component.value as any, {
      href,
      to,
      type: typeof to !== 'string' && href === undefined ? type : undefined,
      disabled: isLoading || isDisabled,
      class: [
        'inline-block',
        isDisabled || isLoading
          ? 'cursor-not-allowed'
          : 'cursor-pointer',
      ],
    })
  })

  return {
    Component,
    state: computed(() => ({
      isLoading: props.value.isLoading,
      isDisabled: props.value.isDisabled,
    })),
  }
}
