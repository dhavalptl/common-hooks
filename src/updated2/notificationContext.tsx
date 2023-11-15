export type Notification = {
    id: string;
    title: string;
    varient: string;
    closeable?: boolean;
    timer?: number;
}

type SetNotification = {
    type: 'add',
    payload: Notification
}

type RemoveNotification = {
    type: 'remove',
    payload: string
}

type RemoveAllNotification = {
    type: 'removeAll'
}

export type Action = SetNotification | RemoveNotification | RemoveAllNotification;

export const initialState: Notification[] = [];

export function notificationReducer(state: Notification[], action: Action): Notification[] {
    switch (action.type) {
        case 'add': {
            return [action.payload, ...state];
        }
        case 'remove': {
            return state.filter((notification) => notification.id !== action.payload);
        }
        case 'removeAll': {
            return initialState;
        }
        default:
            return state;
    }
}