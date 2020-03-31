// components/transition/transition.js
import { transition } from '../utils/transition';
Component({
  externalClasses:[
    'custom-class',
    'enter-class',
    'enter-active-class',
    'enter-to-class',
    'leave-class',
    'leave-active-class',
    'leave-to-class'
  ],
  behaviors: [transition(true)]
})
