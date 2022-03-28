import { Story } from '@storybook/vue3'
import { Button } from '..'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      options: [
        'solid',
        'outline',
        'ghost'
      ],
      control: {
        type: 'radio',
      },
    },
    iconLeft: {
      options: [ undefined, 'folder' ],
    },
    iconRight: {
      options: [ undefined, 'folder' ],
    },
    rounded: {
      options: [
        'none',
        'xs',
        'sm',
        'default',
        'md',
        'lg',
        'full'
      ],
      control: {
        type: 'radio',
      },
    },
  },
  slots: {
    default: {
      type: 'text',
    },
  },
}

const Template: Story = (args) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args">Button</Button>',
})

export const Default = Template.bind({})
