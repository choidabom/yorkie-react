
interface CursorProps {
    x: number;
    y: number;
}

const Cursor = ({ x, y }: CursorProps) => {
    return (
        <img
            src={`src/assets/icon_cursor.svg`}
            className="icon_cursor"
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                transform: `translate(${x}px, ${y}px)`,
                pointerEvents: 'none',
            }}
            alt="cursor"
        />
    );
};

export default Cursor;
