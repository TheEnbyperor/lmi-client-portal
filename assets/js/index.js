import mdcAutoInit from '@material/auto-init';
import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';

mdcAutoInit.register('MDCTextField', MDCTextField);
mdcAutoInit.register('MDCRipple', MDCRipple);

mdcAutoInit();