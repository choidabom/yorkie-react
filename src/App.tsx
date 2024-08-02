import { useEffect, useState } from "react";
import yorkie from "yorkie-js-sdk";
import Cursor from "./Cursor";

interface Presence {
    cursor: {
        xPos: number;
        yPos: number;
    };
}

interface Client {
    clientID: string;
    presence: Presence;
}

const API_ADDR = import.meta.env.VITE_YORKIE_API_ADDR;
const API_KEY = import.meta.env.VITE_YORKIE_API_KEY;

const client = new yorkie.Client(API_ADDR, { apiKey: API_KEY });
const doc = new yorkie.Document('simultaneous-cursors', { enableDevtools: true });

const App = (): JSX.Element => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const setup = async () => {
            await client.activate();

            doc.subscribe('presence', () => {
                setClients(doc.getPresences() as Client[]);
            });

            await client.attach(doc, {
                initialPresence: {
                    cursor: {
                        xPos: 0,
                        yPos: 0,
                    },
                    pointerDown: false,
                }
            });

            window.addEventListener('beforeunload', () => {
                client.deactivate();
            });
        };
        setup();

        const handlePointerUp = () => {
            doc.update((root, presence) => {
                presence.set({
                    pointerDown: false,
                });
            });
        };
        const handlePointerDown = () => {
            doc.update((root, presence) => {
                presence.set({
                    pointerDown: true,
                });
            });
        };
        const handlePointerMove = (event: MouseEvent) => {
            doc.update((root, presence) => {
                presence.set({
                    cursor: {
                        xPos: event.clientX,
                        yPos: event.clientY,
                    }
                });
            });
        };

        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('mousemove', handlePointerMove);

        return () => {
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('mousemove', handlePointerMove);
        };
    }, []);

    return (
        <div className='general-container'>
            {clients.map(({ clientID, presence: { cursor } }) => {
                if (!cursor) {
                    return null;
                }
                return (
                    <Cursor
                        x={cursor.xPos}
                        y={cursor.yPos}
                        key={clientID}
                    />
                );
            })}
        </div>
    );
};

export default App;
