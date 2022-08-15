import { PTZCommand, PTZValue } from './constants';

export interface IControlCameraPTZBody {
    command: PTZCommand;
    value: PTZValue;
}
