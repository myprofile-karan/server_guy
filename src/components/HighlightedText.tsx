const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!query) return <>{text}</>;

    // Find the parts of the text that match and don't match the query
    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};

export default HighlightedText;