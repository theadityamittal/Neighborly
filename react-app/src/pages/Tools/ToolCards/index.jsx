import React, { useState } from 'react';
import HorizontalCard from '../../../components/HorizontalCard/HorizontalCard';
import HorizontalCardModal from '../../../components/HorizontalCard/HorizontalCardModal';

const ToolCards = ({tools, handleCardClick}) => {
    const [selectedTool, setSelectedTool] = useState(null);

    const handleClose = () => {
        setSelectedTool(null);
    }

    return (
    <>
    <div
    style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(2, 1fr)",
    }}
    >
    {tools.map((tool) => (
        <HorizontalCard
        key={tool.tool_id}
        id={tool.tool_id}
        title={tool.title}
        description={tool.description}
        location={tool.neighborhood}
        price={tool.price}
        tags={[tool.condition]}      
        available={tool.available}
        image={tool.images}                   
        onView={() => {
            if (handleCardClick) {
                handleCardClick(tool);
            } else {
                setSelectedTool(tool);
            }
        }}
        />
    ))}
    </div>
    {selectedTool && (
        <HorizontalCardModal
          isOpen={!!selectedTool}
          onClose={handleClose}
          item={selectedTool}
          type="tool"  // must match your API prefix if used
          api_key="borrow"
        />
      )}
    </>
    );
};

export default ToolCards;