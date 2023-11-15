import { useState } from "react";
import { Action, Notification } from "../contexts/notificationContext";
import { useInterval } from "../hooks/useInterval";

type NotificationProps = {
    notification: Notification,
    dispatch: React.Dispatch<Action>
}

function Notification({
notification,
    dispatch 
}: NotificationProps) {
    console.log("Notification ", notification.id);
    const {title, varient, id, timer} = notification;
    const [interval, setInterval] = useState<number | null>(timer || null); 
    useInterval(() => {
        closeNotification(id)
    },  interval);
    function closeNotification(id: string) {
        setInterval(null)
        dispatch({
            type: 'remove',
            payload: id
          })
    }
    return (
        <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <div>{title} - {varient}</div>
        <button onClick={() => {
            closeNotification(id)
        }}>Close</button>
      </div>
    );
}

export default Notification;